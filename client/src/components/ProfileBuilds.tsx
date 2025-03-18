import React from "react";
import { Tabs } from "@mantine/core";
import Builds from "./Builds";
import { useEffect } from "react";
import { FunctionExpression } from "mongoose";
import Post from "./Post";
import { useAuth } from "../hooks/useAuth";
import { useBuildUpdate } from "../hooks/BuildContext";
import useNavigate from "./Navigation/useNavigate";
import { useState } from "react";
import { errorMessage } from "../utils/notification_utils";
import { Text } from '@mantine/core';

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

type propTypes = {
  email: string, 
};



/**
 * This component represents the builds section of the profile page.
 * @param {string} email - The user email
 * @returns {Function} - Cleanup function to abort the fetch
 */
export default function ProfileBuilds({ email } : propTypes
) {
  const { id } = useAuth() ?? {};
  const { setBuild } = useBuildUpdate();
  const navigate = useNavigate();
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [userBuilds, setUserBuilds] = useState<Post[]>([]);


  const handlePostClick = (build: Post) => {
    setBuild(build)
    navigate('/den');
  }

  useEffect(() => {
    const controller = new AbortController();

    /**
     *Get the user's bulds by emails and sets the builds.
     */
    async function getBuilds() {
      const response = await fetch(`/api/user/${email}/builds`);
      const json = await response.json();
      setUserBuilds([...json.builds]);
    }

    
  const getSavedPosts = async () => {
    try{
      const response = await fetch(`/api/user/${email}/saved-posts`);
      const json = await response.json();

      if(!response.ok){
        const error = new Error(json.message);
        errorMessage(error.message);
        throw error;
      }

      setSavedPosts([...json.savedBuilds])
    } catch(e){
      console.error(e);
      errorMessage(e.message);
    }
  }

    getBuilds();
    getSavedPosts();

    return () => {
      controller.abort();
    }
    
  }, [email]);

  /**
   *
   * @param {string} buildId - The build id.
   * @param {boolean} isPublished - Whether or not the post has been set to published.
   */
  function updateBuildStatus(buildId: string, isPublished: boolean) {
    setUserBuilds((prevBuilds) =>
      prevBuilds.map((build) =>
        build._id === buildId ? { ...build, isPublished } : build
      )
    );
  }

  return(
    <section className="profile-builds">
      <Tabs defaultValue="builds">
        <Tabs.List>
          <Tabs.Tab value="builds">
            <h2>Builds</h2>
          </Tabs.Tab>
          <Tabs.Tab value="saves">
            <h2>Saves</h2>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="builds">
          <Builds builds={userBuilds} setBuilds={setUserBuilds} updateBuildStatus={updateBuildStatus} />
        </Tabs.Panel>

        <Tabs.Panel value="saves">
          {savedPosts.length !== 0 ? (savedPosts.map((build, i) => {
            return (
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
            )
          }) 
        ) : (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100%", 
            minHeight: "300px", 
            textAlign: "center" 
          }}>
            <Text 
              size="xl"
              fw={900}
              variant="gradient"
              gradient={{ from: 'green', to: 'lime', deg: 90 }}
            >
              You have not saved any builds. Discover ideas in the forum!
            </Text>
          </div>
        )}
        </Tabs.Panel>
      </Tabs>
    </section>
  )
}