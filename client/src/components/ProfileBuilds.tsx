import React from "react";
import { Tabs } from "@mantine/core";
import Builds from "./Builds";
import { useEffect } from "react";
import '../styles/ProfileBuilds.css';
import Post from "./Post";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Text } from '@mantine/core';
import '../styles/builds.css';
import SavedPosts from "./SavedPosts";

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

type propTypes = {
  email: string, 
};



/**
 * This component represents the builds section of the profile page.
 * @param {string} email - The user email
 * @returns {React.ReactNode} - The section containing the tabs for builds created/saved, and posts from forum saved.
 */
export default function ProfileBuilds({ email } : propTypes
) {
  const { id } = useAuth() ?? {};
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [userBuilds, setUserBuilds] = useState<Post[]>([]);


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
      const response = await fetch(`/api/user/${email}/saved-posts`);
      const json = await response.json();

      setSavedPosts([...json.savedBuilds]);
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
          {userBuilds.length !== 0 ? (
            <Builds builds={userBuilds} setBuilds={setUserBuilds} updateBuildStatus={updateBuildStatus} />
          ):
          (
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
                You have no creations saved. Navigate to the den to start!
              </Text>
            </div>
          )
        }
          
        </Tabs.Panel>

        <Tabs.Panel value="saves">
          {savedPosts.length !== 0 ? (
            <SavedPosts savedPosts={savedPosts} id={id}/>
          )          
           : (
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