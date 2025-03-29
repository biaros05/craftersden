import React, { useEffect, useState } from "react";
import { Autocomplete, Group, Avatar, Text } from "@mantine/core";
import { errorMessage } from "../utils/notification_utils";

type User = {
  avatar: string;
  username: string;
};

type Description = {
  description: string;
};

/**
 * Search bar for forum, description and username searching
 * @param {object} props - The component's props
 * @param {string} props.username - username search
 * @param {string} props.description - description search
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setUsername - Sets the username in Forum component
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setDescription - Sets the description in Forum component
 * @returns {React.ReactNode} - The forum search bar
 */
export function ForumSearch({ username, description, setUsername, setDescription }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); 

    return () => {
      clearTimeout(handler); 
    };
  }, [search]);

  useEffect(() => {
    if (!debouncedSearch) return;

    const controller = new AbortController();

    const handleSearch = async () => {
      try {
        const response = await fetch(`/api/post/search?query=${debouncedSearch}`, {
          method: "GET",
          signal: controller.signal,
        });

        const json = await response.json();

        if (!response.ok) {
          errorMessage(json.message);
          return;
        }

        setUsers(json.users);
        setDescriptions(json.descriptions);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search failed:', error);
        }
      }
    };

    handleSearch();

    return () => controller.abort();
  }, [debouncedSearch]); 

  /**
   * Handle's the user's click on drop down, sets username or description depending on value
   * @param {string} selectedValue - The value that user selects from dropdown
   */
  function handleSubmit(selectedValue: string) {
    const isUser = users.some((user) => user.username === selectedValue);
    const isDescription = descriptions.some((desc) => desc.description === selectedValue);

    if (isUser) {
      setUsername(selectedValue);
      if(description) setDescription('');
    }

    if (isDescription) {
      setDescription(selectedValue);
      if(username) setUsername('');
    }

    setSearch("");
  }

  const userData = users.map((user) => ({
    value: user.username,
    group: 'Users',
    items: (
      <Group key={user.username} gap='sm'>
        <Avatar src={user.avatar} size={36} radius='xl' />
        <Text size='sm'>{user.username}</Text>
      </Group>
    ),
  }));

  const descriptionData = descriptions.map((desc) => ({
    value: desc.description,
    group: 'Build Descriptions',
  }));

  return (
    <Autocomplete
      clearable
      style={{ width: '400px' }}
      label='Search for Posts'
      placeholder='Search username or description...'
      limit={50}
      data={[
        {group: 'Users', items: userData},
        {group: 'Builds', items: descriptionData}
      ]}
      onChange={setSearch}
      value={search}
      onOptionSubmit={handleSubmit}
      onClear={() => {
        setDescription('');
        setUsername('');
      }}
    />
  );
}
