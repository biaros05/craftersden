import React, { useEffect, useState } from "react";
import { errorMessage } from "../utils/notification_utils";

export default function Feedbacks(){
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function getFeedbacks(){
      const response = await fetch('/api/feedback/feedbacks', {method: 'GET'});
      const json = await response.json();

      if(!response.ok){
        errorMessage(json.message);
      }

      setFeedbacks(json.feedbacks);

    }

    getFeedbacks();

    return () => {
      controller.abort();
    }
  }, []);

  return(
    <section className="feedback-section">
      
    </section>
  )
}