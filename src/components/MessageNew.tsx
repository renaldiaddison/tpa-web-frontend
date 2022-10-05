import { useMutation, useQuery } from "@apollo/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  AiFillPicture,
  AiOutlinePicture,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";
import { storage } from "../config/firebase-config";
import { useUserContext } from "../lib/UserContext";
import { AddMessage, AddRoom } from "../queries/MessageQueries";
import { UserConnected } from "../queries/UserQueries";
import { toastError } from "../script/Toast";

const MessageNew = ({ roomData, userBlockData, closeModal }: any) => {
  const UserContext = useUserContext();
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [removeFileStyle, setRemoveFileStyle] = useState("hidden");
  const [buttonDisable, setButtonDisable] = useState(true);
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState({
    userId: "",
  });

  const [localUrl, setLocalUrl] = useState({
    type: "",
    url: "",
  });

  const { loading, data, error } = useQuery(UserConnected, {
    variables: { userId: UserContext.user.id },
  });

  const [roomMutation] = useMutation(AddRoom);

  const [messageMutation] = useMutation(AddMessage);

  useEffect(() => {
    UserContext.refetchUser();
  }, []);

  const showRemoveAttachmentFile = () => {
    if (localUrl.url === "") {
      setRemoveFileStyle("hidden");
    } else {
      setRemoveFileStyle("block");
    }
  };

  useEffect(() => {
    showRemoveAttachmentFile();
  }, [localUrl.url]);

  useEffect(() => {
    if (selectedUser.userId !== "" && (text !== "" || localUrl.url !== "")) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [text, localUrl.url, selectedUser.userId]);

  if (loading || !data) return <p>Loading...</p>;

  const changeImageHandler = (e: any, typeInput: string) => {
    const urlFile = URL.createObjectURL(e.target.files[0]);
    setImageFile((e.target.files as FileList)[0] as File);
    let type = e.target.files[0].type;
    let splitType = type.split("/");

    if (typeInput === splitType[0]) {
      setLocalUrl((prev) => ({
        url: urlFile,
        type: splitType[0],
      }));
      setLocalUrl({ type: typeInput, url: urlFile });
    } else {
      toastError("Invalid Format");
    }
  };

  const removeFileHandler = () => {
    setLocalUrl({ type: "", url: "" });
    setImageFile(undefined);
  };

  const handleAddChat = (imageUrl: string, roomId: string) => {
    if (text == "") setText("Sent a photo");
    messageMutation({
      variables: {
        senderId: UserContext.user.id,
        text: text,
        imageUrl: imageUrl,
        roomId: roomId,
      },
    })
      .then((e) => {
        setSelectedUser((prev) => ({
          userId: "",
        }));
        setLocalUrl({ type: "", url: "" });
        setText("");
        navigate(`/message/${roomId}`);
      })
      .catch((e) => {});
  };

  const handleUploadImage = async (roomId: string) => {
    if (localUrl.url !== "" && localUrl.type !== "") {
      const refStorage = ref(storage, `${roomId}/${(imageFile as File).name}`);
      await uploadBytes(refStorage, imageFile as File, {
        contentType: "message file",
      });
      const imageUrlFromFirebase = await getDownloadURL(refStorage);
      handleAddChat(imageUrlFromFirebase, roomId);
    } else {
      handleAddChat("", roomId);
    }
    closeModal(false)
  };

  const handleAddRoom = () => {
    if (selectedUser.userId !== "") {
      roomMutation({
        variables: {
          userId1: UserContext.user.id,
          userId2: selectedUser.userId,
        },
      })
        .then(async (e) => {
          handleUploadImage(e.data.addRoom.id);
        })
        .catch((e) => {});
    } else {
      toastError("Cannot send message to this user")
    }
  };

  const setSelectUser = (e: any) => {
    let check = false;
    let roomId: string = "";
    roomData.map((roomData: any) => {
      if (
        e.target.value === roomData.user1.id ||
        e.target.value === roomData.user2.id
      ) {
        check = true;
        roomId = roomData.id;
      }
    });

    if (check && roomId !== "") {
      navigate(`/message/${roomId}`);
      closeModal(false)

    } else {
      let checkUserBlock = false;
      let checkCurrentUserBlock = false;

      userBlockData.map((userBlockData: any) => {
        if (userBlockData.blockId === e.target.value) {
          checkUserBlock = true;
        } else if (userBlockData.userId === e.target.value) {
          checkCurrentUserBlock = true;
        }
      });

      if (checkUserBlock) {
        toastError("You cannot send a message, because you blocked this user");
        setSelectedUser(() => ({
          userId: "",
        }));
      } else if (checkCurrentUserBlock) {
        toastError(
          "You cannot send a message, because you are blocked by this user"
        );
        setSelectedUser(() => ({
          userId: "",
        }));
      } else {
        setSelectedUser(() => ({
          userId: e.target.value,
        }));
      }
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal relative">
        <button
          type="button"
          className="close"
          data-modal-toggle="authentication-modal"
          onClick={() => closeModal(false)}
        >
          <svg
            className="w-5 h-5"
            fill="gray"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <h3 className="mb-2">New Message</h3>
        <div className="">
          <div className="">
            {localUrl.url === "" ? null : localUrl.type === "image" ? (
              <img src={localUrl.url} className="w-full border-sizing" alt="" />
            ) : (
              <video
                src={localUrl.url}
                className="w-full border-sizing"
              ></video>
            )}
            <p className="mt-2">Select user to start new message</p>
            {data.UserConnected.length === 0 ? (
              <p className="">No user </p>
            ) : (
              <select
                className="text-input white-bg"
                onChange={setSelectUser}
                defaultValue={""}
              >
                <option value={""} disabled={true}>
                  Select a user
                </option>
                {data.UserConnected.map((connectionUserData: any) => {
                  return (
                    <option
                      value={connectionUserData.id}
                      key={connectionUserData.id}
                    >
                      {connectionUserData.firstName +
                        " " +
                        connectionUserData.lastName}
                    </option>
                  );
                })}
              </select>
            )}
            <textarea
              className="w-full mt-2 input-type"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message..."
              style={{ resize: "none", height: "100px" }}
            ></textarea>
          </div>
          <div className="w-full mt-2">
            <div className="flex">
              <div className="mr-2">
                <label htmlFor="image-input" className="video">
                  <AiFillPicture size={30} />
                </label>

                <input
                  id="image-input"
                  type="file"
                  onChange={(e) => changeImageHandler(e, "image")}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="w-full flex-r mt-1">
              <button
                className="cursor-pointer bg-blue-500 border-blue-500 button-style font-bold rounded-lg text-white px-5 py-1  mr-2 "
                // disabled={buttonDisable}
                onClick={handleAddRoom}
              >
                Send
              </button>
              <button
                className={`cursor-pointer bg-red-500 border-red-500 button-red-style text-white font-bold rounded-lg px-5 py-1 ${removeFileStyle}`}
                onClick={removeFileHandler}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageNew;
