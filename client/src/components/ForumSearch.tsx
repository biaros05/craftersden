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

export function ForumSearch({ username, description, setUsername, setDescription }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [descriptions, setDescriptions] = useState<Description[]>([]);

  useEffect(() => {
    if (!search) return;

    const controller = new AbortController();

    const handleSearch = async () => {
      try {
        const response = await fetch(`/api/post/search?query=${search}`, {
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
        if (error.name !== "AbortError") {
          console.error("Search failed:", error);
        }
      }
    };

    handleSearch();

    return () => controller.abort();
  }, [search]);

  function handleSubmit(selectedValue: string) {
    const isUser = users.some((user) => user.username === selectedValue);
    const isDescription = descriptions.some((desc) => desc.description === selectedValue);

    if (isUser) {
      setUsername(selectedValue);
      setDescription(''); // Clear description if username is selected
    }

    if (isDescription) {
      setDescription(selectedValue);
      setUsername(''); // Clear username if description is selected
    }

    setSearch(''); // Clear input field after selection
  }

  const userData = users.map((user) => ({
    value: user.username,
    group: "Users",
    items: (
      <Group key={user.username} gap="sm">
        <Avatar src={user.avatar} size={36} radius="xl" />
        <Text size="sm">{user.username}</Text>
      </Group>
    ),
  }));

  const descriptionData = descriptions.map((desc) => ({
    value: desc.description,
    group: "Build Descriptions",
  }));

  return (
    <Autocomplete
      clearable
      style={{ width: "400px" }}
      label="Search for Posts"
      placeholder="Search username or description..."
      limit={50}
      data={[...userData, ...descriptionData]}
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
