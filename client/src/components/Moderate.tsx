import React, { useEffect, useState } from "react";
import { errorMessage } from "../utils/notification_utils";
import '../styles/moderate.css';
import { ScrollArea, Title, Text, Tabs} from "@mantine/core";
import ReportCard from "./ReportCard";
import { useAuth } from "../hooks/useAuth";
import Feedbacks from "./Feedbacks";
import Reports from "./Reports";

/**
 *
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