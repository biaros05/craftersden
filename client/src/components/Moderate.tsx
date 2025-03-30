import React, { useEffect, useState } from "react";
import { errorMessage } from "../utils/notification_utils";


export default function Moderate(){
  const [reports, setReports] = useState([]);

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

    

    })
}