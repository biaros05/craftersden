import React, { useEffect, useState } from "react";
import { errorMessage } from "../utils/notification_utils";
import '../styles/moderate.css';
import { ScrollArea, Title, Text, Tabs} from "@mantine/core";
import ReportCard from "./ReportCard";
import { useAuth } from "../hooks/useAuth";
import Feedbacks from "./Feedbacks";

/**
 *
 */
export default function Moderate(){
  const [reports, setReports] = useState([]);
  const {role} = useAuth() ?? {};

  useEffect(() => {
    const controller = new AbortController();

    /**
     *
     */
    async function fetchReports(){
      const response = await fetch('/api/report/reports', {method: 'GET'});
      const json = await response.json();
      if(!response.ok){
        errorMessage(json.message);
        throw new Error(json.message);
      }

      setReports(json.reports);
    };

    fetchReports();

    return () => {
      controller.abort();
    }

  }, []);

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
        <section className='moderator-page'>
        <ScrollArea h={750}>
          <Title className="moderate-title">Reports Created by Users</Title>
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <ReportCard report={report} index={index} setReports={setReports}/>
            ))
          ):
          <Text>No reports at this moment</Text>
          }
        </ScrollArea>
        </section>
      </Tabs.Panel>

      <Tabs.Panel value='feedbacks'>
          <Feedbacks/>
      </Tabs.Panel>

    </Tabs>
  );
}