import { useMutation } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../lib/UserContext";
import {
  AddConnect,
  AddConnectRequest,
  DeleteConnectRequest,
} from "../queries/UserQueries";
import { toastError, toastSuccess } from "../script/Toast";

const UserSearchCard = ({ user, refetchUser }: any) => {
  const [addConnectionMutation] = useMutation(AddConnect);
  const [deleteConnectRequestMutation] = useMutation(DeleteConnectRequest);
  const UserContext = useUserContext();
  const [addConnectRequestMutation] = useMutation(AddConnectRequest);

  let alreadyConnected: boolean = false;
  let alreadyRequested: boolean = false;
  let giveConnectionStatus: boolean = false;
  let alreadyFollowed: boolean = false;
  let alreadyBlocked: boolean = false;

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
            refetchUser().then(() => {
              toastSuccess("Connection Accepted");
            });
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
        refetchUser().then(() => {
          toastSuccess("Connection Ignored!");
        });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  const requestConnectionHandler = (fromUserId: string, toUserId: string) => {
    addConnectRequestMutation({
      variables: {
        fromUserId: fromUserId,
        toUserId: toUserId,
      },
    })
      .then((e) => {
        UserContext.refetchUser();
        refetchUser()
        refetchUser().then(() => {
          toastSuccess("Request Connect Success!");
        });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  UserContext.user.Connection.map((connectionData: any) => {
    if (
      connectionData.user1.id === user.id ||
      connectionData.user2.id === user.id
    ) {
      alreadyConnected = true;
    }
  });

  user.ConnectRequest.map((connectRequestData: any) => {
    if (connectRequestData.fromUser.id === UserContext.user.id) {
      alreadyRequested = true;
    }
  });

  UserContext.user.ConnectRequest.map((connectRequestData: any) => {
    if (connectRequestData.fromUser.id === user.id) {
      giveConnectionStatus = true;
    }
  });

  user.Follows.map((followData: any) => {
    if (followData.followId === user.id) {
      alreadyFollowed = true;
    }
  });

  UserContext.user.Block.map((blockData: any) => {
    if (blockData.blockId === user.id) {
      alreadyBlocked = true;
    }
  });

  return (
    <div className="container">
      <div className="card-suggest">
        <img src={user.profile_picture} className="suggest-img"></img>
        <div className="info">
          <Link to={"/profile/" + user.id}>
            <h1>{user.firstName + " " + user.lastName}</h1>
          </Link>

          <div className="links">
            <>
              {!alreadyConnected && !alreadyRequested && !giveConnectionStatus && (
                <div>
                  <button
                    onClick={() =>
                      requestConnectionHandler(UserContext.user.id, user.id)
                    }
                    className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
                  >
                    Request
                  </button>
                </div>
              )}

              {alreadyConnected && (
                <div>
                  <button className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1">
                    Connected
                  </button>
                </div>
              )}
              {alreadyRequested && (
                <div>
                  <button className="cursor-pointer bg-gray-500 border-gray-500 button-gray-style font-bold rounded-lg text-white px-2 py-1">
                    Requested
                  </button>
                </div>
              )}

              {giveConnectionStatus && (
                <>
                  <div>
                    <button
                      className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
                      onClick={() =>
                        acceptConnectionHandler(
                          user.id,
                          user.id,
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
                        declineConnectionHandler(user.id, UserContext.user.id)
                      }
                    >
                      Ignore
                    </button>
                  </div>
                </>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearchCard;
