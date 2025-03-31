import React, { useEffect, useState } from "react";
import { errorMessage } from "../utils/notification_utils";
import { ScrollArea, Title, Text } from "@mantine/core";
import FeedbackCard from "./FeedbackCard";

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
      console.log(json.feedbacks);
      setFeedbacks(json.feedbacks);

    }

    getFeedbacks();

    return () => {
      controller.abort();
    }
  }, []);

  return(
    <section className="moderator-page">
      <ScrollArea h={750}>
        <Title className='moderator-title'>Feedbacks from Users</Title>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <FeedbackCard feedback={feedback} index={index} setFeedbacks={setFeedbacks}/>
          ))
        ): 
        <Text>No feedbacks at this moment</Text>
        }
      </ScrollArea>
    </section>
  )
}