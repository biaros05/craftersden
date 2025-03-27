import React, { useRef } from 'react';
import Post from './Post';
import '../styles/forum.css';
import useNavigate from "./Navigation/useNavigate.tsx"
import { useBuildUpdate } from '../hooks/BuildContext.tsx';
import { TextInput, Pagination } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import useSwr from 'swr';

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
  tags: []
}

const fetcher = (url) => fetch(url).then(resp => resp.json());
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

  const handlePostClick = (build: Post) => {
    setBuild(build)
    navigate('/den');
  }

  const {data} = useSwr(`/api/post?page=${page}&limit=20`, fetcher, {suspense: true});
  const publishedBuilds = data.builds;
  const scrollToTop = () => forumDiv.current!.scrollTo({ top: 0, behavior: 'smooth' });

  const handlePageChange = (index: number) => {
    setPage(index);
    scrollToTop();
  };

  return (
    <section className="forum-page">
      <TextInput
        placeholder="Search"
        leftSection={<IconSearch size={18} />}
        w={200}
      />
      {publishedBuilds.length !== 0 && (
      <div className="posts" ref={forumDiv}>
          {publishedBuilds.map((build, i) => {
            return (
              <Post
                key={`publishing-${i}`}
                imageURL={build.progressPicture}
                description={build.description}
                builderUsername={build.username}
                buildId={build._id}
                liked={build.likedBy.includes(id)}
                saved={build.savedBy.includes(id)}
                viewPostOnClick={() => handlePostClick(build)}
                tags={build.tags}
              />
            );
          })
        }
        </div>
      )}
      {publishedBuilds.length !== 0 && 
        <div className='pagination-container'>
          <Pagination total={data.total} value={page} onChange={handlePageChange} />
        </div>
      }
    </section>
  );
}