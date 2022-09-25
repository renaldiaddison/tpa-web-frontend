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

const UserSuggestionCard = ({
  userSuggestionData,
  refetchUserSuggestion,
}: any) => {
  const UserContext = useUserContext();

  let alreadyRequested: boolean = false;
  let giveConnectionStatus: boolean = false;

  const [addConnectionMutation] = useMutation(AddConnect);
  const [addConnectRequestMutation] = useMutation(AddConnectRequest);
  const [deleteConnectRequestMutation] = useMutation(DeleteConnectRequest);

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
            refetchUserSuggestion().then(() => {
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
        refetchUserSuggestion().then(() => {
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
        refetchUserSuggestion().then(() => {
          toastSuccess("Request Connect Success!");
        });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  userSuggestionData.ConnectRequest.map((connectRequestData: any) => {
    if (connectRequestData.fromUser.id === UserContext.user.id) {
      alreadyRequested = true;
    }
  });

  UserContext.user.ConnectRequest.map((connectRequestData: any) => {
    if (connectRequestData.fromUser.id === userSuggestionData.id) {
      giveConnectionStatus = true;
    }
  });

  return (
    <div className="container">
      <div className="card-suggest">
        <img
          src={userSuggestionData.profile_picture}
          className="suggest-img"
        ></img>
        <div className="info">
          <Link to={"/profile/" + userSuggestionData.id}>
            <h1>
              {userSuggestionData.firstName +
                " " +
                userSuggestionData.lastName +
                " " +
                userSuggestionData.additionalName}
            </h1>
          </Link>

          <div className="links">
            {!alreadyRequested && !giveConnectionStatus && (
              <div>
                <button
                  onClick={() =>
                    requestConnectionHandler(
                      UserContext.user.id,
                      userSuggestionData.id
                    )
                  }
                  className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
                >
                  Request
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
                        userSuggestionData.id,
                        userSuggestionData.id,
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
                      declineConnectionHandler(
                        userSuggestionData.id,
                        UserContext.user.id
                      )
                    }
                  >
                    Ignore
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSuggestionCard;
