import React, { FormEvent, FormEventHandler } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ActionIcon, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import '../styles/profile.css';
import ProfileBuilds from './ProfileBuilds.tsx';

/**
 * Profile page component that displays list of users
 * my builds, saved builds, liked builds
 * @returns {React.ReactNode} Profile Page
 */
export default function Profile(): React.ReactNode {
  // Detects route changes
  // const location = useLocation(); 
  const {username, email, avatar} = useAuth() ?? {};
  const [opened, {open, close}] = useDisclosure(false);

  const onSubmitHandler: FormEventHandler = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    await fetch('/api/user/', { method: 'PUT', body: formData});
    window.location.reload();
    close();
  };

  return <div className="profile-page container">
    <Modal 
      opened={opened} 
      onClose={close} 
      title="Edit Profile" 
      className="edit-profile-modal" 
      centered 
    >
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" placeholder="Username" maxLength={30}/>
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
    <ProfileBuilds email={email}/>
  </div>;
}