import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../lib/UserContext";

const MessageList = ({ roomData }: any) => {
  const UserContext = useUserContext();
  const navigate = useNavigate();

  return (
    <>
      {roomData.map((roomData: any, index: any) => {
        return (
          <div key={index}>
            {roomData.user1.id === UserContext.user.id ? (
              <div
                onClick={() => navigate(`${roomData.id}`)}
                className="content-user cursor-pointer"
              >
                <div className="flex-r">
                  <div className="mr-2">
                    <img
                      className="picture-profile cover"
                      src={roomData.user2.profile_picture}
                    ></img>
                  </div>

                  <div className="">
                    <p className="cursor-pointer">
                      {roomData.user2.firstName + " " + roomData.user2.lastName}
                    </p>
                    {roomData.lastMessage.imageUrl === "" ? (
                      roomData.lastMessage.sender.id === UserContext.user.id ? (
                        <p className="">You : {roomData.lastMessage.text}</p>
                      ) : (
                        <p className="">
                          {roomData.user2.firstName} :{" "}
                          {roomData.lastMessage.text}
                        </p>
                      )
                    ) : roomData.lastMessage.sender.id ===
                      UserContext.user.id ? (
                      <p className="">You : Sent a photo</p>
                    ) : (
                      <p className="">
                        {roomData.user2.firstName} : Sent a photo
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => navigate(`${roomData.id}`)}
                className="content-user cursor-pointer"
              >
                <div className="flex-r">
                  <div className="mr-2">
                    <img
                      className="picture-profile cover"
                      src={roomData.user1.profile_picture}
                    ></img>
                  </div>

                  <div className="">
                    <p className="cursor-pointer">
                      {roomData.user1.firstName + " " + roomData.user1.lastName}
                    </p>
                    {roomData.lastMessage.imageUrl === "" ? (
                      roomData.lastMessage.sender.id === UserContext.user.id ? (
                        <p className="">You : {roomData.lastMessage.text}</p>
                      ) : (
                        <p className="">
                          {roomData.user1.firstName} :{" "}
                          {roomData.lastMessage.text}
                        </p>
                      )
                    ) : roomData.lastMessage.sender.id ===
                      UserContext.user.id ? (
                      <p className="">You : Sent a photo</p>
                    ) : (
                      <p className="">
                        {roomData.user1.firstName} : Sent a photo
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default MessageList;
