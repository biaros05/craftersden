import React, { useEffect, useState } from "react";
import { errorMessage } from "../utils/notification_utils";
import { ScrollArea, Title, Text } from "@mantine/core";
import ReportCard from "./ReportCard";

/**
 *This represents all the reports to be shown on moderator's reports panel. 
 * @returns {React.ReactNode} - The reports tab components
 */
export default function Reports(){
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    /**
     *Fetches all reports
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

  return(
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
  )

}
