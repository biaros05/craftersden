import React, { useEffect, useState } from "react";
import { errorMessage, successMessage } from "../utils/notification_utils";
import { Card, Group, Avatar, Text, Badge, Button } from "@mantine/core";
import { IconTrash } from '@tabler/icons-react';


type User = {
  email: string,
  username: string,
  avatar: string,
  role: string,
  id: string
};

export default function FeedbackCard({ feedback, index, setFeedbacks }) {
  const [user, setUser] = useState<User | null>(null);
  console.log(`individual feedback:`, feedback)

  useEffect(() => {
    const controller = new AbortController();

    async function setCardData() {
      const response = await fetch(`/api/user/${feedback.author}`, { method: 'GET' });
      const json = await response.json();
      if (!response.ok) {
        return errorMessage(json.message);
      }
      console.log(`user:`, user);
      setUser(json.user);
    }

    setCardData();
    return () => {
      controller.abort();
    }
  }, []);

  async function deleteFeedback() {
    const data = {
      id: feedback._id
    };

    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }

    const response = await fetch('/api/feedback/', requestOptions);
    const json = await response.json();

    if (!response.ok) {
      return errorMessage(json.message);
    }

    setFeedbacks(prevFeedbacks => {
      const newFeedbacks = prevFeedbacks.filer(item => item._id !== feedback._id);
      return newFeedbacks;
    })

    successMessage(json.message);
  };

  return (
    <Card
      key={`feedback-${index}`}
      shadow="md"
      p="md"
      withBorder
    >
      {user && (
        <div>
          <Group align="flex-start" spacing="md">
            <Avatar
              src={user.avatar}
              radius="xl"
              className="h-12 w-12"
            />
            <div>
              <Text weight={500}>
                User: {user.username}
              </Text>
              <div>
                <Badge variant="outline" size="sm">
                  Role: {user.role}
                </Badge>
                <Badge variant="outline" size="sm">
                  {user.email}
                </Badge>
              </div>
            </div>
          </Group>

          <Card>
            <Card.Section p="md">
              <Badge variant='filled' color={
                feedback.type === 'Bug' ? 'orange' :
                  feedback.type === 'Feature' ? 'green' :
                    'gray'
              }>
                {feedback.type}
              </Badge>
              <Text>Message: {feedback.message}</Text>
              <Text size="sm" c="dimmed">
                Created At: {feedback.createdAt}
              </Text>
            </Card.Section>
            <Card.Section p="md">
              <Button
                onClick={deleteFeedback}
                variant="outline"
                size="sm"
                color="red"
              >
                <IconTrash />
              </Button>
            </Card.Section>
          </Card>
        </div>
      )}
    </Card>
  )
}