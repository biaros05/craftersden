import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Inbox({}){
  const [notifications, setNotifications] = useState([]);
  const { id } = useAuth() ?? {};

  useEffect(() => {
    const controller = new AbortController();

    async function fetchNotifs(){

    }
  })
}