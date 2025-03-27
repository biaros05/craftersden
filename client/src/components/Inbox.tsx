import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { errorMessage } from "../utils/notification_utils";
import { Popover, ScrollArea, Stack, Card, Group, Text, ActionIcon, Indicator, Button } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";

type message = {
    id: string,
    message: string, 
    user: string,
    viewed: boolean
}

/**
 * This function component represents the drop down inbox when user clicks on the bell
 * Displays all their notifications with option to clear them.
 * @returns {React.ReactNode} The inbox component with all the notification messages.
 */
export default function Inbox(){
  const [notifications, setNotifications] = useState<message[]>([]);
  const { id } = useAuth() ?? {};

  /**
   * Fetches notifications, 5 second interval fetches again.
   */
  useEffect(() => {
    const controller = new AbortController();

    /**
     * Fetches all the user's notifications.
     */
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
    
    /**
     * Clean up function, clears interval on cleanup as well.
     */
    return () => {
      clearInterval(interval); 
      controller.abort();
    };
  }, []);
  
  /**
   * Marks all messages opened as read.
   */
  async function readAll(){
    const data = {
      id
    }

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };

    const response = await fetch('/api/notifications/read-all', requestOptions);

    if(!response.ok){
      const json = await response.json();
      errorMessage(json.message || 'Notification system failed');
      throw new Error(json.message);
    }
  };

  /**
   * Clears user's notifications.
   */
  async function clearInbox(){
    const data = {
      id
    };

    const requestOptions = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };

    const response = await fetch('/api/notifications/clear', requestOptions);

    if(!response.ok){
      const json = await response.json();
      errorMessage(json.message || 'Notifications system failed');
      throw new Error(json.message);
    }

    setNotifications([]);
  };

  return (
    <Popover width={200} position="bottom" withArrow shadow="md" onOpen={readAll}>
      <Popover.Target>
      <Indicator color="red" size={12} withBorder disabled={!notifications.some(n => !n.viewed)}>
        <ActionIcon variant="subtle" size="lg">
          <IconBell size={34} />
        </ActionIcon>
      </Indicator>
      </Popover.Target>
      <Popover.Dropdown style={{ width: "400px" }}>
        <ScrollArea w="100%" h={150}>
            <Button onClick={clearInbox} style={{'margin':'10px'}} color="orange">
              Clear Inbox
            </Button>
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
                            <Text className="inbox-messages">{notif.message}</Text>
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