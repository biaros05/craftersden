import React, { useEffect, useState } from "react";
import { Card, Group, Text } from "@mantine/core";
import { errorMessage } from "../utils/notification_utils";
import { error } from "console";

export default function ReportCard({report, index}){
  const [user, setUser] = useState(null);
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
    }

    setCardData();

    return () => {
      controller.abort();
    }
  })

  return (
    <Card
      key={`report-${index}`}
      shadow="s,"
      p="sm"
      withBorder
    >
      <Group>
        {report.user_id && <Text>User</Text>}
        <Text></Text>
      </Group>

    </Card>
  )
}