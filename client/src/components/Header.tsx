import React from "react";
import { Avatar, Popover, ScrollArea, Stack, Card, Group, Text } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import Link from './Navigation/Link';
import { useAuth } from "../hooks/useAuth";
import '../styles/header.css';
import { useBuildUpdate } from "../hooks/BuildContext";
import ZombieChaseLoad from "./Loader/ZombieChaseLoad";
import MinecraftButton from "./Custom/MinecraftButton";

/**
 * Header component that allows users to visit
 * /profile, /den and /forum. Changes based on
 * the current page.
 * @returns {React.ReactNode} Header component
 */
export default function Header() {
  const {avatar, loading} = useAuth() ?? {};
  const location = useLocation();
  const isDen = location.pathname === '/den';

    const { setBuild } = useBuildUpdate();

    if (loading) {
        return <ZombieChaseLoad/>;
    }

    const handleDenClick = () => {
        setBuild(undefined);
    }

    return <header id="site-header">
        <Link to='/profile'>
            <Avatar src={avatar} />
        </Link>
        <h2>
            <Link to={isDen ? `/den` : `/forum`} state={{canGoBack: true}}>
                {isDen ? `Crafter's Den` : `Crafter's Forum`}
            </Link>
        </h2>
        <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
                <IconBell size={24}/>
            </Popover.Target>
            <Popover.Dropdown>
                <ScrollArea>
                    <Stack>
                        <Card 
                            shadow="sm" 
                            p="sm" 
                            withBorder 
                            onClick={() => console.log(`Open chat with ${msg.sender}`)}
                            style={{ cursor: "pointer" }}>
                        <Group>
                            <div>
                                <Text>Testing</Text>
                                <Text size="sm" color="dimmed" truncate>Testing 2</Text>
                            </div>
                        </Group>
                        </Card>
                    </Stack>
                </ScrollArea>
            </Popover.Dropdown>
        </Popover>
        <Link 
            to={!isDen ? `/den` : `/forum`}
            state={{canGoBack: true}}
            onClick={handleDenClick}>
            <MinecraftButton>
                {!isDen ? `Den` : `Forum`}
            </MinecraftButton>
        </Link>
    </header>
}