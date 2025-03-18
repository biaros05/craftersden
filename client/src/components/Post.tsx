import React, { useState, useEffect } from 'react';
import { Carousel } from '@mantine/carousel';
import { IconBookmark, IconBookmarkFilled, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { Image, Text, Box, ActionIcon } from '@mantine/core';
import '../styles/Post.css';
import { errorMessage, successMessage } from '../utils/notification_utils';
import { useAuth } from '../hooks/useAuth';

type propTypes = {
  description: string,
  liked: boolean,
  saved: boolean;
  imageURL: string
  username: string
  buildId: string,
  viewPostOnClick?: () => void
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
 * @param {string} props.username Username of the creator
 * @param {Function} props.viewPostOnClick - Function to call when the post is clicked
 * @param {string} props.buildId the id of the build
 * @returns {React.ReactNode} The Post
 */
export default function Post(
  { description, liked, saved, imageURL, username, viewPostOnClick, buildId}: propTypes): React.ReactNode {

  const [isLiked, setIsLiked] = useState(liked);
  const [isSaved, setIsSaved] = useState(saved);
  const [likes, setLikes] = useState(null);
  const [saves, setSaves] = useState(null);
  const {id} = useAuth() ?? {};

  useEffect(() => {
    const controller = new AbortController();

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

      successMessage(json.message);

    } catch(err){
      console.error(err);
      errorMessage(err.message);
    }
  }

  return (
    <div className="post">
      <p style={{textAlign: 'center'}}>{username}</p>
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
            aria-label="Settings"
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
            aria-label="Settings"
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
          <Text size={'xs'} component="p" lineClamp={3} inline={false}>
            {description}
          </Text>
        </Box>
      </section>
    </div>
  );
}