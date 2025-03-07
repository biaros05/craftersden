import React, { useEffect } from 'react';
import Post from './Post';
import '../styles/forum.css';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { errorMessage } from '../utils/notification_utils';
import { useState } from 'react';

const placeholderImages = [
  [
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
  ],
  [
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
  ],
  [
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
  ],
  [
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
  ],
  [
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
  ],
  [
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
  ]
];


/**
 * Forum page renders a Search bar and a
 * list of posts.
 * @returns {React.ReactNode} Forum page.
 */
export default function Forum(): React.ReactNode {

  const [publishedBuilds, setPublishedBuilds] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    (async function getPublishedBuilds() {
      try {
        const response = await fetch('/api/post/', { method: 'GET' });
        const json = await response.json();

        if (!response.ok) {
          const err = new Error('Error while fetching published builds');
          throw err;
        }
        console.log(json);
        setPublishedBuilds(json.builds);
      } catch (err) {
        console.error(err);
        errorMessage(err.message);
      }
    })();

    return () => {
      controller.abort();
    }
  }, [])

  return (
    <section className="forum-page">
      <TextInput
        placeholder="Search"
        leftSection={<IconSearch size={18} />}
        w={200}
      />
      <div className="posts">
        {
          placeholderImages.map((publishedBuilds, i) => {
            return (
              <Post
                key={`post-${i}`}
                description="This is a fun little house to build in the nether!!"
                placeholderImages={images}
                liked={false}
                saved={false}
              />
            );
          })
        }
      </div>
    </section>
  );
}