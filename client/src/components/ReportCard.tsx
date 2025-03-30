import React, { useEffect, useState } from "react";
import { Avatar, Card, Group, Text } from "@mantine/core";
import { errorMessage } from "../utils/notification_utils";
import { error } from "console";
import { ObjectId } from "mongoose";

type User = {
  email: string,
  username : string, 
  avatar: string, 
  role: string, 
  id: ObjectId
};

export default function ReportCard({report, index}){
  const [user, setUser] = useState<User | null>(null);
  const [reporter, setReporter] = useState<User | null>(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function setCardData(){
      if(report.user_id){
        const response = await fetch(`/api/user/${report.user_id}`, {method: 'GET'});
        const json = await response.json();

        if(!response.ok){
          errorMessage(json.message);
          throw new Error(json.message);
        }

        setUser(json.user);
      }
      //could be one or the other (user id or post id only)
      else{
        const response = await fetch(`/api/post/${report.post_id}`, {method: 'GET'});
        const json = await response.json();

        if(!response.ok){
          errorMessage(json.message);
          throw new Error(json.message);
        }
    
        setPost(json.post);
      }
      //sets the reporter
      const reporterResponse = await fetch(`/api/user/${report.reporter}`, {method: 'GET'});
      const reporterJson = await reporterResponse.json();
      if(!reporterResponse.ok){
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

  const timeStamp = report.createdAt.now.toISOString().slice(0, 16).replace('T', ' ');

  return (
    <Card
      key={`report-${index}`}
      shadow="s,"
      p="sm"
      withBorder
    >
        {report.user_id && user && 
        <Group>
          <Avatar src={user.avatar}/>
          <Text>User: {user.username}</Text>
          <Text size="sm">Role: {user.role}</Text>
          <Text size="sm">{user.email}</Text>
          <Text>Reason of report: {report.reason}</Text>
          <Text>Reporter: {reporter?.username}</Text>
          <Text size="sm">Created At: {timeStamp}</Text>
        </Group>  
        }
    </Card>
  )
}