import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NotificationCard from "../components/NotificationCard";
import { useUserContext } from "../lib/UserContext";
import { Notifications } from "../queries/NotificationQueries";

const NotificationPage = () => {
  const UserContext = useUserContext();
  const {
    loading: loadingNotification,
    data: dataNotification,
    error: errorNotification,
    startPolling,
  } = useQuery(Notifications, {
    variables: {
      toUserId: UserContext.user.id,
    },
  });

  useEffect(() => {
    startPolling(500);
  }, []);

  if (loadingNotification) return <p>Get notificatoin data...</p>;
  if (errorNotification) return <p>Error</p>;

  return (
    <div className="white-bg center-col">
      <Navbar></Navbar>
      <div>
        <div className="sec-profile white-bg">
          <div className="flex-r w-full justify-between">
            <p className="text-black text-l bold m-profile">Notifications</p>
          </div>
          {dataNotification.userNotification.length === 0 && (
            <>
              <p className="text-black text-s w-full m-desc">-</p>
              <div className="m-20px"></div>
            </>
          )}
          {dataNotification.userNotification.map((notification: any) => {
            return (
              <NotificationCard
                key={notification.id}
                notificationData={notification}
              />
            );
          })}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default NotificationPage;
