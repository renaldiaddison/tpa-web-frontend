import React from "react";
import { Link } from "react-router-dom";

const NotificationCard = ({ notificationData }: any) => {
  return (
    <div className="container">
      <div className="card-suggest">
        <img
          src={notificationData.fromUser.profile_picture}
          className="suggest-img"
        ></img>
        <div className="info">
          <Link to={"/profile/" + notificationData.fromUser.id}>
            <h1>
              {notificationData.fromUser.firstName +
                " " +
                notificationData.fromUser.lastName}
            </h1>
          </Link>

          <div className="links">
            <>
              <div>
                <p>{notificationData.message}</p>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
