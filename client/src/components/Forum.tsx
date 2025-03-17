import React, { useEffect } from 'react';
import Post from './Post';
import '../styles/forum.css';
import useNavigate from "./Navigation/useNavigate.tsx"
import { useBuildUpdate } from '../hooks/BuildContext.tsx';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { errorMessage } from '../utils/notification_utils';
import { useState } from 'react';


type Post = {
  _id: string,
  user: string,
  progressPicture: string,
  username: string,  
  description: string,
  buildJSON: object,
  isPublished: boolean,
  thumnails: [],
}

/**
 * Forum page renders a Search bar and a
 * list of posts.
 * @returns {React.ReactNode} Forum page.
 */
export default function Forum(): React.ReactNode {

  const navigate = useNavigate();
  const { setBuild } = useBuildUpdate();

  const handlePostClick = (build: Post) => {
    setBuild(build)
    navigate('/den');
  }

  const [publishedBuilds, setPublishedBuilds] = useState<Post[]>([]);
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
        {publishedBuilds.length !== 0 ? (
          publishedBuilds.map((build, i) => {
            return (
              <Post
                key={`publishing-${i}`}
                imageURL={build.progressPicture}
                description={build.description}
                username={build.username}
                buildId={build._id}
                liked={false}
                saved={false}
                viewPostOnClick={() => handlePostClick(build)}
              />
            );
          })
        ) : (
          <p>Fetching builds...</p>
        )
        }
      </div>
    </section>
  );
}