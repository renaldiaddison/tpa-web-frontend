import { useMutation } from "@apollo/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { storage } from "../config/firebase-config";
import { useUserContext } from "../lib/UserContext";
import {
  AddConnect,
  DeleteConnectRequest,
  UpdateBackgroundPicture,
  UpdateProfilePicture,
} from "../queries/UserQueries";
import stringGen from "../script/helper";
import { toastError, toastSuccess } from "../script/Toast";

const UserInformation = ({ currentUser, refetchCurrentUser, edit }: any) => {
  const [updateProfilePicture] = useMutation(UpdateProfilePicture);
  const [updateBackgroundPicture] = useMutation(UpdateBackgroundPicture);

  const [addConnectionMutation] = useMutation(AddConnect);
  const [deleteConnectRequestMutation] = useMutation(DeleteConnectRequest);
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

  const declineConnectionHanlder = (fromUserId: string, toUserId: string) => {
    deleteConnectRequestMutation({
      variables: {
        fromUserId: fromUserId,
        toUserId: toUserId,
      },
    })
      .then((e) => {
        UserContext.userRefetch();
        refetchCurrentUser().then(() => {
          toastSuccess("Connection Ignored");
        });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  return (
    <div className="profile bg-white">
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
        <p className="text-black m-profile text-xl mt-5">
          {currentUser.firstName + " " + currentUser.lastName}
        </p>
        <div className="picture-btn text-bg cover">
          <AiFillEdit className="logo"></AiFillEdit>
        </div>
      </div>

      {currentUser.Experiences.map((experience: any) => {
        if (experience.Active) {
          return (
            <p key={experience.ID} className="text-black text-m m-desc">
              {experience.Description} at {experience.CompanyName}
            </p>
          );
        }
      })}

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

      {/* <div className="w-full flex-r m-20px">
        {!edit &&
          !data.getUserById.ConnectRequest.includes(UserContext.user.id) &&
          !data.getUserById.connected_user.includes(UserContext.user.id) && (
            <div>
              <button
                onClick={() => {
                  requestConnect({
                    variables: {
                      id: UserContext.user.id,
                      recipientID: currProfile.id,
                    },
                  }).then(() => {
                    userQuery.refetch();
                  });
                }}
                className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
              >
                Request
              </button>
            </div>
          )}

        {!edit && currProfile.request_connect.includes(user?.id) && (
          <div>
            <button className="cursor-pointer bg-gray-500 border-gray-500 button-gray-style text-white font-bold rounded-lg text-white px-2 py-1">
              Requested
            </button>
          </div>
        )}
        {!edit && currProfile.connected_user.includes(user?.id) && (
          <div>
            <button className="cursor-pointer bg-white button-style text-white font-bold rounded-lg text-white px-2 py-1">
              Connected
            </button>
          </div>
        )}

        <div className="ml-2">
          {!edit && !user.followed_user.includes(currProfile.id) && (
            <div>
              <button
                onClick={() => {
                  follow({
                    variables: { id: user.id, followedID: currProfile.id },
                  }).then(() => {
                    // refetchUser();
                  });
                }}
                className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
              >
                Follow
              </button>
            </div>
          )}
          {!edit && user.followed_user.includes(currProfile.id) && (
            <div>
              <button
                onClick={() => {
                  unFollow({
                    variables: {
                      id: user.id,
                      unfollowedID: currProfile.id,
                    },
                  }).then(() => {
                    // refetchUser();
                  });
                }}
                className="cursor-pointer bg-red-500 border-red-500 button-red-style text-white font-bold rounded-lg text-white px-2 py-1"
              >
                Unfollow
              </button>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default UserInformation;
