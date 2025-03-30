import React, { useEffect, useState } from "react";
import { errorMessage, successMessage } from "../utils/notification_utils";
import { Card } from "@mantine/core";

type User = {
  email: string,
  username: string,
  avatar: string,
  role: string,
  id: ObjectId
};

export default function FeedbackCard({feedback, index, setFeedbacks}){
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function setCardData(){
      const response = await fetch(`/api/user${feedback.author}`, {method: 'GET'});
      const json = await response.json();
      if(!response.ok){
        return errorMessage(json.message);
      }

      setUser(json.user);
    }
    
    return () => {
      controller.abort();
    }
  },[]);
  
  async function deleteFeedback(){
    const data = {
      id: feedback._id
    };

    const requestOptions = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }

    const response = await fetch('/api/feedback/', requestOptions);
    const json = await response.json();

    if(!response.ok){
      return errorMessage(json.message);
    }

    setFeedbacks(prevFeedbacks => {
      const newFeedbacks = prevFeedbacks.filer(item => item._id !== feedback._id);
      return newFeedbacks;
    })

    successMessage(json.message);
  };

  return(
    <Card
      key={`report-${index}`}
      shadow="md"
      p="md"
      withBorder
    >

    </Card>
  )
}