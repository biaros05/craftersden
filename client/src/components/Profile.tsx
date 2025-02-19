import React, { FormEvent, FormEventHandler } from "react";
import { useAuth } from "../hooks/useAuth";
import { Tabs, ActionIcon, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import '../styles/profile.css'

export default function Profile() {
    const {username, email, avatar} = useAuth() ?? {};
    const [opened, {open, close}] = useDisclosure(false);

    const onSubmitHandler: FormEventHandler = async (event: FormEvent) => {
      event.preventDefault();
      const target = event.target as HTMLFormElement;
      const formData = new FormData(target);
      console.log(formData)
      await fetch('/api/user/', { method: 'PUT', body: formData});
      close();
    };

    return <div className="profile-page">
      <Modal opened={opened} onClose={close} title="Edit Profile" className="edit-profile-modal" centered >
        <form onSubmit={onSubmitHandler}>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" placeholder="Username" />
          <label htmlFor="avatar">Upload an image!</label>
          <input type="file" id="avatar" name="avatar" 
            accept="image/png, image/jpeg, image/jpg, image/webp" />
          <Button type="submit" className="form-submit">Submit</Button>
        </form>
      </Modal>

      <section className="user-info">
        <div className="big-profile-image-wrapper">
          <img src={avatar} alt="profile picture" className="big-profile-image" />
        </div>
        <div className="name-area">
          <div>
            <h2>{username}</h2>
            <p>{email}</p>
          </div>
          <ActionIcon variant="filled" size="lg" aria-label="Edit Profile" onClick={open} >
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