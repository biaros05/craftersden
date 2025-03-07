import React from "react";
import { Tabs } from "@mantine/core";
import Builds from "./Builds";
import { useEffect, useState } from "react";

type Build = {
  _id: string,
  progressPicture: string,
  description: string,
  buildJSON: object,
  isPublished: boolean,
  thumnails: [],
}

/**
 * This component represents the builds section of the profile page.
 * @param {string} email - The user email
 * @returns {Function} - Cleanup function to abort the fetch
 */
export default function ProfileBuilds({ email } : {email: string}
) {

  const [userBuilds, setUserBuilds] = useState<Build[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    /**
     *Get the user's bulds by emails and sets the builds.
     */
    async function getBuilds() {
      const response = await fetch(`/api/user/${email}/builds`);
      const json = await response.json();
      console.log(json.builds);
      setUserBuilds([...json.builds]);
    }

    getBuilds();

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

  console.log(`userBuilds: ${userBuilds}`);
  return(
    <section className="profile-builds">
      <Tabs defaultValue="builds" >
        <Tabs.List>
          <Tabs.Tab value="builds">
            <h2>Builds</h2>
          </Tabs.Tab>
          <Tabs.Tab value="saves">
            <h2>Saves</h2>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="builds">
          <Builds builds={userBuilds} updateBuildStatus={updateBuildStatus} />
        </Tabs.Panel>

        <Tabs.Panel value="saves">
          Saves go here
        </Tabs.Panel>
      </Tabs>
    </section>
  )
}