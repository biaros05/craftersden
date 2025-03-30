import React, { useEffect, useState } from "react";
import { Avatar, Card, Group, Text, Badge } from "@mantine/core";
import { errorMessage } from "../utils/notification_utils";
import { error } from "console";
import { ObjectId } from "mongoose";

type User = {
  email: string,
  username: string,
  avatar: string,
  role: string,
  id: ObjectId
};


type Post = {
  _id: string,
  user: string,
  progressPicture: string,
  username: string,
  avatar: string,
  description: string,
  buildJSON: object,
  isPublished: boolean,
  thumnails: [],
  likedBy: (string | undefined)[];
  savedBy: (string | undefined)[]
  tags: []
}

export default function ReportCard({ report, index }) {
  const [user, setUser] = useState<User | null>(null);
  const [reporter, setReporter] = useState<User | null>(null);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function setCardData() {
      if (report.user_id) {
        const response = await fetch(`/api/user/${report.user_id}`, { method: 'GET' });
        const json = await response.json();

        if (!response.ok) {
          errorMessage(json.message);
          throw new Error(json.message);
        }

        setUser(json.user);
      }
      //could be one or the other (user id or post id only)
      else {
        const response = await fetch(`/api/post/${report.post_id}`, { method: 'GET' });
        const json = await response.json();

        if (!response.ok) {
          errorMessage(json.message);
          throw new Error(json.message);
        }

        setPost(json.post);
      }
      //sets the reporter
      const reporterResponse = await fetch(`/api/user/${report.reporter}`, { method: 'GET' });
      const reporterJson = await reporterResponse.json();
      if (!reporterResponse.ok) {
        errorMessage(reporterJson.message)
        throw new Error(reporterJson.message);
      }

      setReporter(reporterJson.user);
    }

    setCardData();

    return () => {
      controller.abort();
    }
  }, []);

  if (post) console.log(`post`, post);
  if (user) console.log("user:", user);
  return (
    <Card
      key={`report-${index}`}
      shadow="md"
      p="md"
      withBorder
      className="w-full max-w-[600px] transition-all hover:shadow-lg"
    >
      {report.user_id && user && (
        <div className="space-y-4">
          <Group align="flex-start" spacing="md">
            <Avatar
              src={user.avatar}
              radius="xl"
              className="h-12 w-12"
            />
            <div className="space-y-2">
              <Text weight={500}>
                User: {user.username}
              </Text>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" size="sm">
                  Role: {user.role}
                </Badge>
                <Badge variant="outline" size="sm">
                  {user.email}
                </Badge>
              </div>
            </div>
          </Group>

          <Card className="bg-gray-50">
            <Card.Section p="md">
              <Text weight={500}>Report Details</Text>
              <div className="mt-2 space-y-2">
                <Text size="sm">Reason: {report.reason}</Text>
                <Text size="sm">Reporter: {reporter?.username}</Text>
                <Text size="sm" c="dimmed">
                  Created At: {report.createdAt}
                </Text>
              </div>
            </Card.Section>
          </Card>
        </div>
      )}

      {report.post_id && post && (
        <Card className="mt-4 bg-gray-50">
          <Card.Section p="md">
            <Text weight={500}>Post Report</Text>
            <div className="mt-2 space-y-2">
              <Text size="sm">Reporter: {reporter?.username}</Text>
              <Text size="sm">Reason: {report.reason}</Text>
              <Text size="sm">{post.description}</Text>
              <Text size="sm">Creator: {post.username}</Text>
              <Text size="sm" c="dimmed">
                  Created At: {report.createdAt}
              </Text>
            </div>
          </Card.Section>
        </Card>
      )}
    </Card>
  )
}