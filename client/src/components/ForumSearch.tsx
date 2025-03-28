import React, { useEffect, useState } from "react";
import { Autocomplete, Group, Avatar, Text } from "@mantine/core";
import { errorMessage } from "../utils/notification_utils";

type User = {
  avatar: string;
  username: string;
};

type Description = {
  description: string
}

export function ForumSearch() {
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

  const userData = users.flatMap((user, i) => ({
    value: user.username,
    group: "Users",
    items: [(
      <Group key={user.username} gap="sm">
        <Avatar src={user.avatar} size={36} radius="xl" />
        <Text size="sm">{user.username}</Text>
      </Group>
    )],
  }));

  const descriptionData = descriptions.flatMap((desc, i) => ({
    value: desc.description,
    group: "Build Descriptions",
    items: [desc.description]
  }));

  return (
    <Autocomplete
      clearable 
      defaultValue=''
      style={{width: '400px'}}
      label="Search for Posts"
      placeholder="Search username or description..."
      limit={50}
      // data={[...userData, ...descriptionData]}
      data={[
        { group: 'Users', items: userData},
        { group: 'Builds', items: descriptionData}
      ]}
      onChange={setSearch}
      value={search}
    />
  );
}
