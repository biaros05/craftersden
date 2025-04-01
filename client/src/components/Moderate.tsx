import React from "react";
import '../styles/moderate.css';
import { Text, Tabs} from "@mantine/core";
import { useAuth } from "../hooks/useAuth";
import Feedbacks from "./Feedbacks";
import Reports from "./Reports";

/**
 * The moderator's page. Checks if user is a moderator before proceeding. 
 * Shows 2 tabs, reports and feedbacks.
 * @returns {React.ReactNode} - The moderator component.
 */
export default function Moderate(){
  const {role} = useAuth() ?? {};
  if (role !== 'moderator') {
    return (
      <section className="not-authorized">
            <Text>
              You are not permitted to view this page
            </Text>
      </section>
    );
  }
  return(
    <Tabs defaultValue='reports'>
      <Tabs.List>
        <Tabs.Tab value='reports'>
          Reports
        </Tabs.Tab>
        <Tabs.Tab value='feedbacks'>
          Feedbacks
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='reports'>
        <Reports/>
      </Tabs.Panel>

      <Tabs.Panel value='feedbacks'>
          <Feedbacks/>
      </Tabs.Panel>

    </Tabs>
  );
}