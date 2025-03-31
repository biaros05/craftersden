import React, { useRef } from 'react';
import Post from './Post';
import '../styles/forum.css';
import useNavigate from "./Navigation/useNavigate.tsx"
import { useBuildUpdate } from '../hooks/BuildContext.tsx';
import { Pagination, Text } from '@mantine/core';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import useSwr from 'swr';
import { ForumSearch } from './ForumSearch.tsx';

type Post = {
  _id: string,
  user: string,
  progressPicture: string,
  username: string,
  avatar: string,  
  description: string,
  buildJSON: object,
  isPublished: boolean,
  thumnails: [],
  likedBy: (string | undefined)[];
  savedBy: (string | undefined)[]
  tags: []
}

/**
 * Forum page renders a Search bar and a
 * list of posts.
 * @returns {React.ReactNode} Forum page.
 */
export default function Forum(): React.ReactNode {
  const forumDiv = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { setBuild } = useBuildUpdate();
  const { id } = useAuth() ?? {};
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');

  const handlePostClick = (build: Post) => {
    setBuild(build)
    navigate('/den');
  }

  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', '20');
  if (username) queryParams.append('username', username);
  if (description) queryParams.append('description', description);

  const fetcher = (url) => fetch(url).then(resp => resp.json());
  const { data } = useSwr(`/api/post?${queryParams.toString()}`, fetcher, { suspense: true });
  
  const publishedBuilds = data?.builds || [];

  const scrollToTop = () => forumDiv.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const handlePageChange = (index: number) => {
    setPage(index);
    scrollToTop();
  };

  return (
    <section className="forum-page">
      <ForumSearch username={username} description={description} setUsername={setUsername} setDescription={setDescription} />
      {publishedBuilds.length !== 0 ? (
      <div className="posts" ref={forumDiv}>
          {publishedBuilds.map((build, i) => {
            return (
              <Post
                key={`publishing-${i}`}
                imageURL={build.progressPicture}
                description={build.description}
                avatar={build.avatar}
                builderUsername={build.username}
                buildId={build._id}
                liked={build.likedBy.includes(id)}
                saved={build.savedBy.includes(id)}
                viewPostOnClick={() => handlePostClick(build)}
                tags={build.tags}
                userId={build.user}
              />
            );
          })
        }
        </div>
      ) : (
        <Text id="no-posts-message">No posts to display!</Text>
      )}
      {publishedBuilds.length !== 0 && 
        <div className='pagination-container'>
          <Pagination total={data.total} value={page} onChange={handlePageChange} />
        </div>
      }
    </section>
  );
}