import React, { useEffect, useState } from "react";
import { Card, Group, Text } from "@mantine/core";

export default function ReportCard({report, index}){
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function setCardData(){
      if(report.)
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