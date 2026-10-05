import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

let connection = null;

export const useNotificationSignalR = () => {
  const connectionRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5135/api";
    const hubUrl = API_URL.replace("/api", "") + "/hubs/notifications";

    if (connection && connection.state === "Connected") {
      return;
    }

    let cancelled = false;

    import("@microsoft/signalr").then((signalR) => {
      if (cancelled) return;

      if (!connection) {
        connection = new signalR.HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: () => token,
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
          .build();

        connection.on("notificationReceived", (notification) => {
          toast.info(notification.message || "لديك إشعار جديد", {
            autoClose: 5000,
          });
        });
      }

      connectionRef.current = connection;

      connection
        .start()
        .catch(() => {});
    });

    return () => {
      cancelled = true;
      if (connection && connection.state === "Connected") {
        connection.stop().catch(() => {});
        connection = null;
      }
      connectionRef.current = null;
    };
  }, []);
};
