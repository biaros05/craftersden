import React from "react";
import Post from "./Post";
import { useBuildUpdate } from "../hooks/BuildContext";
import useNavigate from "./Navigation/useNavigate";

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
  savedBy: (string | undefined)[];
};

export default function SavedPosts({ savedPosts, id }: { savedPosts: Post[], id: string | undefined }) {
  const { setBuild } = useBuildUpdate();
  const navigate = useNavigate();

  const handlePostClick = (build: Post) => {
    setBuild(build);
    navigate('/den');
  };

  return (
    <section id="saved-posts">
      {savedPosts.length !== 0 ? (
        savedPosts.map((build, i) => (
          <Post
            key={`saved-${i}`}
            imageURL={build.progressPicture}
            description={build.description}
            username={build.username}
            buildId={build._id}
            liked={build.likedBy.includes(id)}
            saved={build.savedBy.includes(id)}
            viewPostOnClick={() => handlePostClick(build)}
          />
        ))
      ) : (
        <p>No saved posts to display.</p>
      )}
    </section>
  );
}
