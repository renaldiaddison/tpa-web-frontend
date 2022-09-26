import { useMutation } from "@apollo/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { storage } from "../config/firebase-config";
import { useUserContext } from "../lib/UserContext";
import { AddNotification } from "../queries/NotificationQueries";
import {
  AddBlock,
  AddConnect,
  AddConnectRequest,
  DeleteBlock,
  DeleteConnectRequest,
  FollowUser,
  UnFollowUser,
  UpdateBackgroundPicture,
  UpdateProfilePicture,
} from "../queries/UserQueries";
import stringGen from "../script/Helper";
import { toastError, toastSuccess } from "../script/Toast";
import UpdateUserModal from "./UpdateUserModal";

const UserInformation = ({ currentUser, refetchCurrentUser, edit }: any) => {
  const [updateProfilePicture] = useMutation(UpdateProfilePicture);
  const [updateBackgroundPicture] = useMutation(UpdateBackgroundPicture);

  const [addConnectionMutation] = useMutation(AddConnect);
  const [addConnectRequestMutation] = useMutation(AddConnectRequest);
  const [deleteConnectRequestMutation] = useMutation(DeleteConnectRequest);
  const [followMutation] = useMutation(FollowUser);
  const [unFollowMutation] = useMutation(UnFollowUser);
  const [blockMutation] = useMutation(AddBlock);
  const [deleteBlockMutation] = useMutation(DeleteBlock);
  const [notificationMutation] = useMutation(AddNotification);

  const [updateUserModal, setUpdateUserModal] = useState(false);

  let alreadyConnected: boolean = false;
  let alreadyRequested: boolean = false;
  let giveConnectionStatus: boolean = false;
  let alreadyFollowed: boolean = false;
  let alreadyBlocked: boolean = false;

  const UserContext = useUserContext();

  const handleFileChange = async (e: any) => {
    const image = e.target.files[0];
    if (image === undefined) {
      toastError("Please input png, jpg, or jpeg");
    } else {
      const stringId = stringGen(20);
      const storageRef = ref(storage, `images/${stringId}`);
      uploadBytes(storageRef, image).then(() => {
        getDownloadURL(storageRef).then((url) => {
          updateProfilePicture({
            variables: {
              id: currentUser.id,
              imageUrl: url,
            },
          }).then(() => {
            refetchCurrentUser();
            UserContext.refetchUser();
          });
        });
      });
    }
  };

  const handleBackgroundChange = async (e: any) => {
    const background = e.target.files[0];
    if (background === undefined) {
      toastError("Please input png, jpg, or jpeg");
    } else {
      const stringId = stringGen(25);
      const imageRef = ref(storage, `background/${stringId}`);
      uploadBytes(imageRef, background).then(() => {
        getDownloadURL(imageRef).then((url) => {
          updateBackgroundPicture({
            variables: {
              id: currentUser.id,
              imageUrl: url,
            },
          }).then(() => {
            refetchCurrentUser();
            UserContext.refetchUser();
          });
        });
      });
    }
  };

  const createNotification = (
    fromUserId: string,
    toUserId: string,
    message: string
  ) => {
    if (fromUserId !== toUserId) {
      notificationMutation({
        variables: {
          toUserId: toUserId,
          fromUserId: fromUserId,
          message: message,
        },
      })
        .then((e) => {
          console.log(e);
        })
        .catch((e) => {
          toastError(e);
        });
    }
  };

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
            refetchCurrentUser().then(() => {
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
        refetchCurrentUser().then(() => {
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
        refetchCurrentUser().then(() => {
          toastSuccess("Request Connect Success!");
        });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  const handleFollow = () => {
    followMutation({
      variables: {
        id1: UserContext.user.id,
        id2: currentUser.id,
      },
    })
      .then(() => {
        UserContext.refetchUser()
          .then((e: any) => {})
          .catch((e: any) => {
            toastError(e);
          });

        refetchCurrentUser()
          .then((e: any) => {
            toastSuccess("Follow Success!");
            createNotification(
              UserContext.user.id,
              currentUser.id,
              "Started Following You"
            );
          })
          .catch((e: any) => {
            toastError(e);
          });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  const handleUnfollow = () => {
    unFollowMutation({
      variables: {
        id1: UserContext.user.id,
        id2: currentUser.id,
      },
    })
      .then(() => {
        UserContext.refetchUser()
          .then((e: any) => {})
          .catch((e: any) => {
            toastError(e);
          });

        refetchCurrentUser()
          .then((e: any) => {
            toastSuccess("Unfollow Success!");
            createNotification(
              UserContext.user.id,
              currentUser.id,
              "Unfollowed You"
            );
          })
          .catch((e: any) => {
            toastError(e);
          });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  const handleBlock = () => {
    blockMutation({
      variables: {
        userId: UserContext.user.id,
        blockId: currentUser.id,
      },
    })
      .then((e) => {
        UserContext.refetchUser();
        refetchCurrentUser().then((e: any) => {
          toastSuccess("Block Success!");
        });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  const handleUnBlockUser = () => {
    deleteBlockMutation({
      variables: {
        userId: UserContext.user.id,
        blockId: currentUser.id,
      },
    })
      .then((e) => {
        UserContext.refetchUser();
        refetchCurrentUser().then((e: any) => {
          toastSuccess("Unblock Success!");
        });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  UserContext.user.Connection.map((connectionData: any) => {
    if (
      connectionData.user1.id === currentUser.id ||
      connectionData.user2.id === currentUser.id
    ) {
      alreadyConnected = true;
    }
  });

  currentUser.ConnectRequest.map((connectRequestData: any) => {
    if (connectRequestData.fromUser.id === UserContext.user.id) {
      alreadyRequested = true;
    }
  });

  UserContext.user.ConnectRequest.map((connectRequestData: any) => {
    if (connectRequestData.fromUser.id === UserContext.user.id) {
      giveConnectionStatus = true;
    }
  });

  currentUser.Follows.map((followData: any) => {
    if (followData.followId === currentUser.id) {
      alreadyFollowed = true;
    }
  });

  UserContext.user.Block.map((blockData: any) => {
    if (blockData.blockId === currentUser.id) {
      alreadyBlocked = true;
    }
  });

  return (
    <div className="profile bg-white">
      {updateUserModal && (
        <UpdateUserModal closeModal={setUpdateUserModal}></UpdateUserModal>
      )}
      <div
        className="w-full flex-col bg-white"
        style={{
          backgroundImage: "url(" + currentUser.background_picture + ")",
          backgroundRepeat: "no-repeat",
          borderRadius: "10px 10px 0 0",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full flex-r relative">
          <label htmlFor="background" className="w-fit">
            {edit && (
              <div className="picture-btn text-bg cover">
                <AiFillEdit className="logo"></AiFillEdit>
              </div>
            )}
          </label>
        </div>
        <div className="w-full flex-row">
          <label
            htmlFor="file"
            className={edit === true ? "cursor-pointer" : ""}
          >
            <img
              className="profile-picture cover m-profile white-bg"
              src={currentUser.profile_picture}
            ></img>
          </label>
        </div>
      </div>
      <div className="flex relative w-full">
        <p className="text-black ml-20px text-m">
          {currentUser.firstName +
            " " +
            currentUser.lastName +
            " " +
            currentUser.additionalName}
        </p>
        {edit && (
          <div
            className="picture-btn text-bg cover"
            onClick={() => setUpdateUserModal(true)}
          >
            <AiFillEdit className="logo"></AiFillEdit>
          </div>
        )}
      </div>

      {currentUser.Experiences.map((experience: any) => {
        if (experience.Active) {
          return (
            <p key={experience.ID} className="text-black ml-20px text-m">
              {experience.Description} at {experience.CompanyName}
            </p>
          );
        }
      })}

      <p className="ml-20px text-m text-black">
        <b>{currentUser.Connection.length}</b> Connections,
        <b> {currentUser.Visits.length}</b> Profile views
      </p>

      <input
        disabled={!edit}
        type="file"
        name="file"
        id="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          handleFileChange(e);
        }}
      />

      <input
        disabled={!edit}
        type="file"
        name="background"
        id="background"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          handleBackgroundChange(e);
        }}
      />

      {edit ? null : (
        <div className="w-full flex-r m-20px">
          {!alreadyConnected && !alreadyRequested && !giveConnectionStatus && (
            <div>
              <button
                onClick={() =>
                  requestConnectionHandler(UserContext.user.id, currentUser.id)
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
                      currentUser.id,
                      currentUser.id,
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
                      currentUser.id,
                      UserContext.user.id
                    )
                  }
                >
                  Ignore
                </button>
              </div>
            </>
          )}

          <div className="ml-2">
            {!alreadyFollowed && (
              <div>
                <button
                  onClick={() => {
                    handleFollow();
                  }}
                  className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
                >
                  Follow
                </button>
              </div>
            )}
            {alreadyFollowed && (
              <div>
                <button
                  onClick={() => {
                    handleUnfollow();
                  }}
                  className="cursor-pointer bg-red-500 border-red-500 button-red-style text-white font-bold rounded-lg text-white px-2 py-1"
                >
                  Unfollow
                </button>
              </div>
            )}
          </div>
          <div className="ml-2">
            {!alreadyBlocked && (
              <div>
                <button
                  onClick={() => {
                    handleBlock();
                  }}
                  className="cursor-pointer bg-red-500 border-red-500 button-red-style text-white font-bold rounded-lg text-white px-2 py-1"
                >
                  Block
                </button>
              </div>
            )}
            {alreadyBlocked && (
              <div>
                <button
                  onClick={() => {
                    handleUnBlockUser();
                  }}
                  className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
                >
                  Unblock
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInformation;
