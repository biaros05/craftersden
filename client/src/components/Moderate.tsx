import React, { useEffect, useState } from "react";
import { errorMessage } from "../utils/notification_utils";
import '../styles/moderate.css';
import { ScrollArea, Title, Text} from "@mantine/core";
import ReportCard from "./ReportCard";
import { useAuth } from "../hooks/useAuth";

export default function Moderate(){
  const [reports, setReports] = useState([]);
  const {role} = useAuth() ?? {};

  useEffect(() => {
    const controller = new AbortController();

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
    <section className='moderator-page'>
      <ScrollArea h={750}>
        <Title id="moderate-title">Reports Created by Users</Title>
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <ReportCard report={report} index={index} setReports={setReports}/>
          ))
        ):
        <Text>No reports at this moment</Text>
        }
      </ScrollArea>
    </section>
  );
}