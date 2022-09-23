import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../lib/UserContext";
import {
  AddConnect,
  DeleteConnectRequest,
  GetUserById,
} from "../queries/UserQueries";
import { toastError, toastSuccess } from "../script/Toast";

const UserSuggestionCard = ({ userSuggestionData }: any) => {
  const UserContext = useUserContext();
  const navigate = useNavigate();
  const {
    loading,
    error,
    data,
    called,
    refetch: currentUserRefect,
  } = useQuery(GetUserById, {
    variables: { userId: userSuggestionData.id },
    errorPolicy: "all",
  });
  const [modalConnect, setModalConnect] = useState(false);
  const [addConnectionMutation] = useMutation(AddConnect);
  const [deleteConnectRequestMutation] = useMutation(DeleteConnectRequest);
  let connectedUser: boolean = false;
  let connectionRequest: boolean = false;
  let giveConnectionStatus: boolean = false;

  const handleGoToProfile = (userId: string) => {
    navigate(`/mainPage/profile/${userId}`);
  };

  useEffect(() => {
    currentUserRefect();
  }, [data]);

  if (loading) return <p>Get user data...</p>;

  const userData = data.User;

  const accpetConnectionHandler = (
    user1ID: string,
    fromUserId: string,
    toUserId: string
  ) => {
    addConnectionMutation({
      variables: {
        user1ID: user1ID,
        user2ID: UserContext.User.id,
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
            UserContext.userRefetch();
            currentUserRefect().then(() => {
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

  const declineConnectionHanlder = (fromUserId: string, toUserId: string) => {
    deleteConnectRequestMutation({
      variables: {
        fromUserId: fromUserId,
        toUserId: toUserId,
      },
    })
      .then((e) => {
        UserContext.userRefetch();
        currentUserRefect().then(() => {
          toastSuccess("Connection Ignored");
        });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  const handleConnectModal = () => {
    if (modalConnect === false) setModalConnect(true);
    else setModalConnect(false);
  };

  UserContext.User.Connections.map((connectionData: any) => {
    if (
      connectionData.user1.id === userData.id ||
      connectionData.user2.id === userData.id
    ) {
      connectedUser = true;
    }
  });

  userData.ConnectRequests.map((connectRequestData: any) => {
    if (connectRequestData.fromUser.id === UserContext.User.id) {
      connectionRequest = true;
    }
  });

  UserContext.User.ConnectRequests.map((connectRequestData: any) => {
    console.log(connectRequestData);

    if (
      connectRequestData.toUser.id === UserContext.User.id &&
      connectRequestData.fromUser.id == userSuggestionData.id
    ) {
      giveConnectionStatus = true;
    }
  });

  return (
    <>
      <div className="profile-container__right-container__content1-container__user-profile-container">
        <div
          className="user-profile"
          onClick={() => handleGoToProfile(userSuggestionData.id)}
        >
          {userSuggestionData.profileImageUrl ? (
            <img src={userSuggestionData.profileImageUrl} alt="" />
          ) : (
            <img src="../../src/assets/dummy_avatar.jpg" alt="" />
          )}
        </div>
        <div className="user-content">
          <p className="name">
            {userSuggestionData.firstName} {userSuggestionData.lastName}
          </p>
          <p className="degree">{userSuggestionData.headline}</p>
          <p className="location">
            {userSuggestionData.city} {userSuggestionData.country}
          </p>
          {connectedUser ? (
            <button className="button3">Connected</button>
          ) : connectionRequest ? (
            <button className="button3">Requested</button>
          ) : giveConnectionStatus ? (
            <>
              <button
                className="button2"
                onClick={() =>
                  accpetConnectionHandler(
                    userData.id,
                    userData.id,
                    UserContext.User.id
                  )
                }
              >
                Accept
              </button>
              <button
                className="button1"
                onClick={() =>
                  declineConnectionHanlder(userData.id, UserContext.User.id)
                }
              >
                Ignore
              </button>
            </>
          ) : (
            <button className="button2" onClick={handleConnectModal}>
              Connect
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSuggestionCard;
