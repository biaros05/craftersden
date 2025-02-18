import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Tabs, ActionIcon } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import '../styles/profile.css'

export default function Profile() {
    const {username, email, avatar} = useAuth() ?? {};

    return <div className="profile-page">
      <section className="user-info">
        <div className="big-profile-image-wrapper">
          <img src={avatar} alt="profile picture" className="big-profile-image" />
        </div>
        <div className="name-area">
          <div>
            <h2>{username}</h2>
            <p>{email}</p>
          </div>
          <ActionIcon variant="filled" size="lg" aria-label="Edit Profile">
            <IconEdit />
          </ActionIcon>
        </div>
      </section>
      <section className="profile-builds">
        <Tabs defaultValue="builds" >
          <Tabs.List>
            <Tabs.Tab value="builds">
              <h2>Builds</h2>
            </Tabs.Tab>
            <Tabs.Tab value="saves">
              <h2>Saves</h2>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="builds">
            Builds go here
          </Tabs.Panel>

          <Tabs.Panel value="saves">
            Saves go here
          </Tabs.Panel>
        </Tabs>
      </section>
    </div>
}