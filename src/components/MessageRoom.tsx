import { useMutation, useQuery } from "@apollo/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  AiOutlinePicture,
  AiOutlineSend,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { GiCancel } from "react-icons/gi";

import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../config/firebase-config";
import { useUserContext } from "../lib/UserContext";
import { AddMessage, Room } from "../queries/MessageQueries";
import { toastError } from "../script/Toast";
import MessageCard from "./MessageCard";

const MessageRoom = ({ userBlockData }: any) => {
  const { roomId } = useParams();
  const UserContext = useUserContext();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File>();
  const [buttonDisable, setButtonDisable] = useState(true);
  const [removeFileStyle, setRemoveFileStyle] = useState("hidden");
  const [text, setText] = useState("");
  const [localUrl, setLocalUrl] = useState({
    url: "",
    type: "",
  });

  const { loading, error, data, startPolling } = useQuery(Room, {
    variables: { roomId: roomId },
  });
  const [messageMutation] = useMutation(AddMessage);

  let checkUserBlock = "";
  let checkCurrentUserBlock = "";

  const showRemoveAttachmentFile = () => {
    if (localUrl.url === "") {
      setRemoveFileStyle("hidden");
    } else {
      setRemoveFileStyle("block");
    }
  };

  useEffect(() => {
    startPolling(500);
  }, []);

  useEffect(() => {
    if (text !== "" || localUrl.url !== "") {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [text, localUrl.url]);

  useEffect(() => {
    showRemoveAttachmentFile();
  }, [localUrl.url]);

  if (loading || !data) return <p>Get Chat Data...</p>;

  const removeFileHandler = () => {
    setLocalUrl({ type: "", url: "" });
    setImageFile(undefined);
  };

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
    } else {
      toastError("Invalid Format");
    }
  };

  const handleAddChat = (imageUrl: string, roomId: string) => {
    messageMutation({
      variables: {
        senderId: UserContext.user.id,
        text: text,
        imageUrl: imageUrl,
        roomId: roomId,
      },
    })
      .then((e) => {
        setLocalUrl((prev) => ({
          url: "",
          type: "",
        }));
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
  };

  const handleCreateMessage = () => {
    handleUploadImage(data.room.id);
  };

  userBlockData.map((userBlockData: any) => {
    if (
      userBlockData.blockId === UserContext.user.id &&
      (userBlockData.userId === data.room.user1.id ||
        userBlockData.userId === data.room.user2.id)
    ) {
      checkCurrentUserBlock = "blocked";
    } else if (
      userBlockData.userId === UserContext.user.id &&
      (userBlockData.blockId === data.room.user1.id ||
        userBlockData.blockId === data.room.user2.id)
    ) {
      checkUserBlock = "blocked";
    }
  });

  return (
    <>
      <div className="h-full relative">
        <div className="border-b-1 user-profile-message">
          {data.room.user1.id === UserContext.user.id ? (
            <>
              <img
                className="picture-profile cover mt-2 ml-2"
                src={data.room.user2.profile_picture}
              ></img>
              <div className="mt-2 ml-2 mb-2 text-s">
                {data.room.user2.firstName} {data.room.user2.lastName}
              </div>
            </>
          ) : (
            <>
              <img
                className="picture-profile cover mt-2 ml-2"
                src={data.room.user1.profile_picture}
              ></img>
              <div className="mt-2 ml-2 mb-2 text-s">
                {data.room.user1.firstName} {data.room.user1.lastName}
              </div>
            </>
          )}
        </div>
        <div className="m-2 message-mid-content">
          <div className="message-page-content">
            {checkUserBlock === "" && checkCurrentUserBlock === "" ? (
              <div className="">
                {data.room.messages.map((messageData: any) => {
                  return (
                    <div className="">
                      <div className="mb-4">
                        {/* {messageData.text !== "" && (
                          <MessageText messageData={messageData} />
                        )}
                        {messageData.imageUrl !== "" && (
                          <MessageMyImage messageData={messageData} />
                        )} */}

                        <MessageCard messageData={messageData}></MessageCard>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="">
                {checkUserBlock !== "" ? (
                  <p className="">
                    You cannot send a message, because you blocked this user
                  </p>
                ) : (
                  <p className="">
                    You cannot send a message, because you are blocked
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {checkUserBlock === "" && checkCurrentUserBlock === "" && (
          <div className="w-full absolute message-bottom-content">
            {localUrl.url === "" ? null : localUrl.type === "image" ? (
              <div className="text-preview">Preview Image</div>
            ) : (
              <div>Preview Video</div>
            )}
            {/* {localUrl.url === "" ? null : localUrl.type === "image" ? (
              <img src={localUrl.url} className="w-full border-sizing" alt="" />
            ) : (
              <video
                src={localUrl.url}
                className="w-full border-sizing"
              ></video>
            )} */}

            <div className="w-full">
              <div className="flex">
                <textarea
                  className="border-sizing"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a message..."
                  style={{ resize: "none", width: "92%" }}
                ></textarea>

                <div className="h-full button-message-container">
                  <div className="">
                    <label htmlFor="image-input" className="cursor-pointer">
                      <AiOutlinePicture size={25} />
                    </label>

                    <input
                      id="image-input"
                      type="file"
                      onChange={(e) => changeImageHandler(e, "image")}
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="">
                    <label
                      htmlFor=""
                      className="cursor-pointer"
                      onClick={handleCreateMessage}
                    >
                      <AiOutlineSend size={25} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageRoom;
