import React, { useState, useEffect } from 'react';
import { Carousel } from '@mantine/carousel';
import { IconBookmark, IconBookmarkFilled, IconHeart, IconHeartFilled, IconFlag } from '@tabler/icons-react';
import { Image, Text, Box, ActionIcon, Pill, ScrollArea, Avatar, Group } from '@mantine/core';
import '../styles/Post.css';
import { errorMessage, successMessage } from '../utils/notification_utils';
import { useAuth } from '../hooks/useAuth';
import ReportButton from './ReportButton';

type propTypes = {
  description: string,
  liked: boolean,
  saved: boolean;
  imageURL: string
  builderUsername: string
  buildId: string,
  viewPostOnClick?: () => void
  tags: []
  avatar: Blob
  userId: string
}

/**
 * Component for a single post with a carousel of images
 * like, and save buttons.
 * @param {object} props - React Props
 * @param {string} props.description Post description
 * @param {boolean} props.liked Whether the post is liked
 * @param {boolean} props.saved Whether the post is saved
 * Rida was here
 * @param {string} props.imageURL Snapshot of the build
 * @param {string} props.builderUsername Username of the creator
 * @param {string} props.avatar Profile avatar of user.
 * @param {Function} props.viewPostOnClick - Function to call when the post is clicked
 * @param {string} props.buildId the id of the build
 * @param {Array} props.tags tags of the build post
 * @param {string} props.userId id of creator
 * @returns {React.ReactNode} The Post
 */
export default function Post(
  { description, liked, saved, imageURL, builderUsername, avatar, viewPostOnClick, buildId, tags = [], userId}: propTypes): React.ReactNode {

  const [isLiked, setIsLiked] = useState(liked);
  const [isSaved, setIsSaved] = useState(saved);
  const [likes, setLikes] = useState(null);
  const [saves, setSaves] = useState(null);
  const {id, username} = useAuth() ?? {};

  /**
   * Posts a notification to user's inbox in database with custom message.
   * @param {string} message - The message to be assigned to notification.
   */
  async function sendNotification(message : string){
    const data = {
      message,
      username: builderUsername
    };

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };

    const response = await fetch('/api/notifications/post', requestOptions);

    if(!response.ok){
      const json = await response.json();
      errorMessage(json.message || "Notification system failed.");
      throw new Error(json.message);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    /**
     * Retrieves the likesk and saves of the post and sets them.
     */
    async function getLikesSaves(){
      const response = await fetch(`/api/post/${buildId}/likes-saves`, { method: 'GET' });
      const json = await response.json();
      setLikes(json.likedBy.length);
      setSaves(json.savedBy.length);
    }


    getLikesSaves();

    return () => {
      controller.abort();
    }
  }, [isLiked, isSaved]);

  const toggleLike = async () => {
    const data = {
      isLiked: !isLiked,
      buildId,
      id
    };
  
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      };
  
      const response = await fetch('/api/post/toggle-like', requestOptions);
      const json = await response.json();
  
      if (!response.ok) {
        const err = new Error(json.message);
        errorMessage(err.message);
        throw err;
      }
  
      setIsLiked(!isLiked);
      setLikes(prevLikes => (isLiked ? prevLikes - 1 : prevLikes + 1)); 
      
      if(!isLiked){
        const message = `${username} liked your build "${description}"`;
        sendNotification(message);
      }

      successMessage(json.message);
    } catch (err) {
      console.error(err);
      errorMessage(err.message);
    }
  };
  

  const toggleSave = async () => {
    const data = {
      isSaved: !isSaved,
      buildId, 
      id
    }

    try{
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      console.log(requestOptions);
      const response = await fetch('/api/post/toggle-save', requestOptions);
      const json = await response.json();
      
      if(!response.ok){
        const error = new Error(json.message);
        errorMessage(error.message);
        throw error;
      }

      setIsSaved(!isSaved);
      setSaves(prevSaves => (isSaved ? prevSaves - 1 : prevSaves + 1));

      if(!isSaved){
        const message = `${username} saved your build "${description}"`;
        sendNotification(message);
      }
      successMessage(json.message);

    } catch(err){
      console.error(err);
      errorMessage(err.message);
    }
  }

  return (
    <div className="post">
      <Group justify="space-between">
        <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
          <Avatar src={avatar} radius="xl" size="md" />
          <Text className="post-usernames" weight={500} size="sm">{builderUsername}</Text>
        </div>
        <ReportButton userId={userId} buildId={buildId} username={builderUsername}/>
      </Group>
      <Carousel
        height={125}
        slideSize="100%"
        align="start"
        slideGap="md"
        dragFree
        slidesToScroll={1}
        onClick = {viewPostOnClick}
      >
        {
        <Carousel.Slide key={imageURL}>
          <Image src={imageURL} />
        </Carousel.Slide>
          
        }
      </Carousel>
      <section className="post-information">
        <div className="post-actions">
          <ActionIcon
            className="icons"
            color="rgba(74, 173, 24, 1)"
            variant="subtle"
            aria-label="save"
            onClick={() => {
              toggleSave();
            }}
          >
            {
              isSaved ?
              <IconBookmarkFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
              :
              <IconBookmark style={{ width: '70%', height: '70%' }} stroke={1.5} />
            }
            <p>{saves}</p>
          </ActionIcon>
          <ActionIcon
            className="icons"
            color="rgba(74, 173, 24, 1)"
            variant="subtle"
            aria-label="like"
            onClick={() => {
              toggleLike();
            }}
            >
            <p>{likes}</p>
            {
              isLiked ?
                <IconHeartFilled />
                :
                <IconHeart style={{ width: '70%', height: '70%' }} stroke={1.5} />
            }
          </ActionIcon>
        </div>
        <Box>
          <Text size={'xs'} 
          component="p" 
          lineClamp={3} 
          inline={false}
          style={{
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'normal', 
            wordBreak: 'break-word', 
            padding: '15px'
          }}
          >
            {description}
          </Text>
        </Box>
        {tags.length !== 0 && (
          <ScrollArea className="tags-area" h={80}>
            {tags.map((tag, i) => {
              return(
                <Pill 
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white', 
                  fontWeight: 'bold',
                  margin: '2px'
                }}
                size="sm"
                className="tag"
                key={`tag-${i}`}
                >
                  {tag}
                </Pill>
              )
            })}
          </ScrollArea>
        )}
      </section>
    </div>
  );
}