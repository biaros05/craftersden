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

export default function ProfileBuilds({ email }
) {

  const [userBuilds, setUserBuilds] = useState<Build[]>([]);

  useEffect(() => {
    /**
     * Fetches all builds for a user and updates
     * builds state
     */
    async function getBuilds() {
      const response = await fetch(`/api/user/${email}/builds`);
      const json = await response.json();
      console.log(json.builds);
      setUserBuilds([...json.builds]);
    }

    getBuilds();

  }, [email]);

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