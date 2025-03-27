import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { errorMessage } from "../utils/notification_utils";
import { Popover, ScrollArea, Stack, Card, Group, Text, ActionIcon, Indicator } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";

type message = {
    id: string,
    message: string, 
    user: string,
    viewed: boolean
}

export default function Inbox({}){
  const [notifications, setNotifications] = useState<message[]>([]);
  const { id } = useAuth() ?? {};

  useEffect(() => {
    const controller = new AbortController();

    async function fetchNotifs(){
      const data = {
        id
      };

      const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      };
      const response = await fetch('/api/notifications/', requestOptions);
      const json = await response.json();

      if(!response.ok){
        const err = new Error('Cannot fetch notifications');
        errorMessage(json.message);
        throw err;
      }

      setNotifications(json.notifications);
    }

    fetchNotifs();

    return () => {
      controller.abort();
    }
  });
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
          <ActionIcon variant="subtle" size="lg">
              <IconBell size={34} />
          </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown style={{ width: "400px" }}>
        <ScrollArea w="100%" h={150}>
            <Stack
            align="stretch"
            justify="center"
            gap="md"
            >
              {notifications.length > 0 ? (
                notifications.map((notif, index) => (
                <Card 
                    key={`card-${index}`}
                    shadow="sm" 
                    p="sm" 
                    withBorder 
                    onClick={() => console.log(`Opens chat`)}
                    style={{ cursor: "pointer" }}
                >
                    <Group>
                        <div>
                            <Text>{notif.message}</Text>
                        </div>
                    </Group>
                </Card>
                ))
              ) : (
                <Card>
                  <Text>You have no new notifications</Text>
                </Card>
              )}
            </Stack>
        </ScrollArea>
        </Popover.Dropdown>
    </Popover>
  )

}