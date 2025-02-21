import React from 'react';
import { Carousel } from '@mantine/carousel';
import { IconArrowRight, IconArrowLeft, IconBookmark, IconHeart } from '@tabler/icons-react';
import { Image, Text, Box } from '@mantine/core';
import '../assets/Post.css'; 

export default function Post({placeholderImages, description}) {
  return (
    <div className="post" style={{ width: '250px'}}>
      <Carousel
      height={125}
        slideSize="100%" align="start" slideGap="md" dragFree withIndicators slidesToScroll={1}
      >
        {
          placeholderImages.map((url) => (
            <Carousel.Slide key={url}>
              <Image src={url} />
            </Carousel.Slide>
          ))
        }
      </Carousel>
      <section className='post-information'>
        <div className='post-actions'>
          <IconBookmark className="icons"/>
          <p>Username</p>
          <IconHeart className="icons"/>
        </div>
        <Box>
          <Text size={'xs'} component="p" lineClamp={3} inline={false}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde provident eos fugiat id
            necessitatibus magni ducimus molestias. Placeat, consequatur. Quisquam, quae magnam
            perspiciatis excepturi iste sint itaque sunt laborum. Nihil?
          </Text>
        </Box>
      </section>
    </div>
  );
}