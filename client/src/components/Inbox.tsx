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

    async function fetchNotifs() {
      try {
        const response = await fetch(`/api/notifications/${id}`, {method: 'GET'});
        const json = await response.json();
  
        if (!response.ok) {
          throw new Error(json.message || 'Cannot fetch notifications');
        }
  
        setNotifications(json.notifications);
      } catch (error) {
        errorMessage(error.message);
      }
    }
  
    fetchNotifs(); 
  
    const interval = setInterval(fetchNotifs, 5000);
  
    return () => {
      clearInterval(interval); 
      controller.abort();
    };
  }, []);
  


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