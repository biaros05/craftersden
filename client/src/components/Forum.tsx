import React, { useEffect } from 'react';
import Post from './Post';
import '../styles/forum.css';
import useNavigate from "./Navigation/useNavigate.tsx"
import { useBuildUpdate } from '../hooks/BuildContext.tsx';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import CreeperLoad from './Loader/CreeperLoad.tsx';
import ZombieChaseLoad from './Loader/ZombieChaseLoad.tsx';
import { useWindowSize } from "@uidotdev/usehooks";
import { useAuth } from '../hooks/useAuth.tsx';


type Post = {
  _id: string,
  user: string,
  progressPicture: string,
  username: string,  
  description: string,
  buildJSON: object,
  isPublished: boolean,
  thumnails: [],
  likedBy: (string | undefined)[];
  savedBy: (string | undefined)[]
}

/**
 * Forum page renders a Search bar and a
 * list of posts.
 * @returns {React.ReactNode} Forum page.
 */
export default function Forum(): React.ReactNode {

  const navigate = useNavigate();
  const { setBuild } = useBuildUpdate();
  const { id } = useAuth() ?? {};

  const handlePostClick = (build: Post) => {
    setBuild(build)
    navigate('/den');
  }

  const {width} = useWindowSize();

  const [publishedBuilds, setPublishedBuilds] = useState<Post[]>([]);

  
  useEffect(() => {
    const controller = new AbortController();

    /**
     * Retrieves all the builds that are published.
     */
    async function getPublishedBuilds() {
        const response = await fetch('/api/post/', { method: 'GET' });
        const json = await response.json();

        setPublishedBuilds([...json.builds]);
    };

    getPublishedBuilds();

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
      {publishedBuilds.length !== 0 && (
      <div className="posts">
          {publishedBuilds.map((build, i) => {
            return (
              <Post
                key={`publishing-${i}`}
                imageURL={build.progressPicture}
                description={build.description}
                username={build.username}
                buildId={build._id}
                liked={build.likedBy.includes(id)}
                saved={build.savedBy.includes(id)}
                viewPostOnClick={() => handlePostClick(build)}
              />
            );
          })
        }
        </div>
      )}
      {
        publishedBuilds.length === 0 && width! < 400 &&
        <CreeperLoad/>
      }
      {
        publishedBuilds.length === 0 && width! > 400 &&
        <ZombieChaseLoad/>
      }
    </section>
  );
}