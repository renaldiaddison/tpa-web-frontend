import { useMutation } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../lib/UserContext";
import { AddConnect, DeleteConnectRequest } from "../queries/UserQueries";
import { toastError, toastSuccess } from "../script/Toast";

const UserConnectRequestCard = ({ userFrom }: any) => {
  const [addConnectionMutation] = useMutation(AddConnect);
  const [deleteConnectRequestMutation] = useMutation(DeleteConnectRequest);
  const UserContext = useUserContext();

  const acceptConnectionHandler = (
    user1ID: string,
    fromUserId: string,
    toUserId: string
  ) => {
    addConnectionMutation({
      variables: {
        user1ID: user1ID,
        user2ID: UserContext.user.id,
      },
    })
      .then((e) => {
        deleteConnectRequestMutation({
          variables: {
            fromUserId: fromUserId,
            toUserId: toUserId,
          },
        })
          .then((e) => {
            UserContext.refetchUser();
            toastSuccess("Connection Accepted");
          })
          .catch((e) => {
            toastError(e);
          });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  const declineConnectionHandler = (fromUserId: string, toUserId: string) => {
    deleteConnectRequestMutation({
      variables: {
        fromUserId: fromUserId,
        toUserId: toUserId,
      },
    })
      .then((e) => {
        UserContext.refetchUser();
        toastSuccess("Connection Ignored!");
      })
      .catch((e) => {
        toastError(e);
      });
  };

  return (
    <div className="container">
      <div className="card-suggest">
        <img src={userFrom.profile_picture} className="suggest-img"></img>
        <div className="info">
          <Link to={"/profile/" + userFrom.id}>
            <h1>{userFrom.firstName + " " + userFrom.lastName}</h1>
          </Link>

          <div className="links">
            <>
              <div>
                <button
                  className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
                  onClick={() =>
                    acceptConnectionHandler(
                      userFrom.id,
                      userFrom.id,
                      UserContext.user.id
                    )
                  }
                >
                  Accept
                </button>
              </div>
              <div className="ml-2">
                <button
                  className="cursor-pointer bg-red-500 border-red-500 button-red-style text-white font-bold rounded-lg text-white px-2 py-1"
                  onClick={() =>
                    declineConnectionHandler(userFrom.id, UserContext.user.id)
                  }
                >
                  Ignore
                </button>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserConnectRequestCard;
