import React, { useEffect, useState } from "react";
import { Avatar, Card, Group, Text, Badge, Button } from "@mantine/core";
import { errorMessage, successMessage } from "../utils/notification_utils";
import { IconTrash } from '@tabler/icons-react';
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

/**
 *
 * @param root0
 * @param root0.report
 * @param root0.index
 * @param root0.setReports
 */
export default function ReportCard({ report, index, setReports }) {
  const [user, setUser] = useState<User | null>(null);
  const [reporter, setReporter] = useState<User | null>(null);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    /**
     *
     */
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

  /**
   *
   */
  async function deleteReport(){

    const data = {
      id: report._id
    };
    
    const requestOptions = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }

    const response = await fetch('/api/report/', requestOptions);
    const json = await response.json();

    if(!response.ok){
      return errorMessage(json.message);
    }
    
    setReports(prevReports => {
      const newReports = prevReports.filter(item => item._id !== report._id);
      return newReports;
    });

    successMessage(json.message);
  }

  return (
    <Card
      key={`report-${index}`}
      shadow="md"
      p="md"
      withBorder
    >
      {report.user_id && user && (
        <div>
          <Group align="flex-start" spacing="md">
            <Avatar
              src={user.avatar}
              radius="xl"
              className="h-12 w-12"
            />
            <div>
              <Text fw={700} c='red'>
                Reported User: {user.username}
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
              <Text weight={500}>Report Details</Text>
              <div>
                <Text size="sm">Reason: {report.reason}</Text>
                <Text size="sm">Reporter: {reporter?.username}</Text>
                <Text size="sm" c="dimmed">
                  Created At: {report.createdAt}
                </Text>
              </div>
            </Card.Section>
            <Card.Section p="md">
            <Button
              variant="outline"
              size="sm"
              color="red"
              onClick={deleteReport}
            >
              <IconTrash />
            </Button>
          </Card.Section>
          </Card>
        </div>
      )}

      {report.post_id && post && (
        <Card className="mt-4 bg-gray-50">
          <Card.Section p="md">
            <Text c='red' fw={700}>Post Report</Text>
            <div className="mt-2 space-y-2">
              <Text size="sm">Reporter: {reporter?.username}</Text>
              <Text size="sm">Reason: {report.reason}</Text>
              <Text size="sm">Post Description: {post.description}</Text>
              <Text size="sm">Creator: {post.username}</Text>
              <Text size="sm" c="dimmed">
                Created At: {report.createdAt}
              </Text>
            </div>
          </Card.Section>
          <Card.Section p="md">
            <Button
              onClick={deleteReport}
              variant="outline"
              size="sm"
              color="red"
            >
              <IconTrash />
            </Button>
          </Card.Section>
        </Card>
      )}
    </Card>
  )
}