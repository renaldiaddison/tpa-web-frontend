import React from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../lib/UserContext";
// import "../styles/my-network.scss";
// import "../styles/css-library.scss";

const UserConnectionCard = ({ connection }: any) => {
  const UserContext = useUserContext();
  let user1IsUser: boolean = true;

  if (connection.user1.id === UserContext.user.id) {
    user1IsUser = false;
  }

  return (
    <div className="container">
      {user1IsUser ? (
        <div className="card-suggest">
          <img
            src={connection.user1.profile_picture}
            className="suggest-img"
          ></img>
          <div className="info">
            <Link to={"/profile/" + connection.user1.id}>
              <h1>
                {connection.user1.firstName + " " + connection.user1.lastName}
              </h1>
            </Link>

            <div className="links">
              <>
                <div>
                  <button className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1">
                    Connected
                  </button>
                </div>
              </>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-suggest">
          <img
            src={connection.user2.profile_picture}
            className="suggest-img"
          ></img>
          <div className="info">
            <Link to={"/profile/" + connection.user2.id}>
              <h1>
                {connection.user2.firstName + " " + connection.user2.lastName}
              </h1>
            </Link>

            <div className="links">
              <>
                <div>
                  <button className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1">
                    Connected
                  </button>
                </div>
              </>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserConnectionCard;
