import React from 'react';
import { Carousel } from '@mantine/carousel';
import { IconArrowRight, IconArrowLeft, IconBookmark, IconHeart } from '@tabler/icons-react';
import { Image } from '@mantine/core';
import '../assets/Post.css'; 

export default function Post({placeholderImages}) {
  return (
    // <Carousel
    //   style={{ flex: 1 }}
    //   height={180}
    //   slideSize="50%"
    //   nextControlIcon={<IconArrowRight size={16} />}
    //   previousControlIcon={<IconArrowLeft size={16} />}
    // >
    //   <Carousel.Slide>1</Carousel.Slide>
    //   <Carousel.Slide>2</Carousel.Slide>
    //   <Carousel.Slide>3</Carousel.Slide>
    //   {/* ...other slides */}
    // </Carousel>
    <div className="post" style={{ width: '50%'}}>
      <Carousel
      height={200}
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
          <IconBookmark/>
          <p>Username</p>
          <IconHeart/>
        </div>
        <p>This is a fun wooden home perfect for building in the nether right next to a lava pool!</p>
      </section>
    </div>
  );
}