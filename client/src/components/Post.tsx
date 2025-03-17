import React, { useState } from 'react';
import { Carousel } from '@mantine/carousel';
import { IconBookmark, IconBookmarkFilled, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { Image, Text, Box, ActionIcon } from '@mantine/core';
import '../styles/Post.css';
import { errorMessage, successMessage } from '../utils/notification_utils';
import { useAuth } from '../hooks/useAuth';
import { request } from 'http';

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
 * @param {string} props.userId the id of the user.
 * @returns {React.ReactNode} The Post
 */
export default function Post(
  { description, liked, saved, imageURL, username, viewPostOnClick, buildId}: propTypes): React.ReactNode {

  const [isLiked, setIsLiked] = useState(liked);
  const [isSaved, setIsSaved] = useState(saved);
  const {id} = useAuth() ?? {};

  const toggleLike = async (isLiked, buildId, user_id) => {
    const data = {
      isLiked,
      buildId,
      user_id
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
        const response = await fetch('/api/post/like', requestOptions);
        const json = await response.json();

        if(!response.ok){
          const err = new Error(json.message);
          errorMessage(err.message);
          throw err;
        }

        successMessage(json.message);

    }catch(err){
      console.error(err);
      errorMessage(err.message);
    }
  }

  return (
    <div className="post">
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
              setIsSaved(!isSaved);

            }}
          >
            {
              isSaved ?
                <IconBookmarkFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
                :
                <IconBookmark style={{ width: '70%', height: '70%' }} stroke={1.5} />
            }
          </ActionIcon>

          <p>{username}</p>

          <ActionIcon
            className="icons"
            color="rgba(74, 173, 24, 1)"
            variant="subtle"
            aria-label="Settings"
            onClick={() => {
              setIsLiked(!isLiked);
              toggleLike(!isLiked, buildId, id);
            }}
          >
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