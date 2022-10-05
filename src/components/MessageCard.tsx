import React from "react";

const MessageCard = ({ messageData }: any) => {
  return (
    <div className="">
      <div className="flex">
        <img
          className="message-profile-pic cover"
          src={messageData.sender.profile_picture}
        ></img>
        <div className="text-s ml-2">
          <div className="">
            {messageData.sender.firstName + " " + messageData.sender.lastName}
          </div>
          {messageData.text !== "" && messageData.imageUrl !== "" && (
            <>
              <div className="mt-2">{messageData.text}</div>
              <img
                className="mt-2 message-image"
                src={messageData.imageUrl}
              ></img>
            </>
          )}
          {messageData.text !== "" && messageData.imageUrl === "" && (
            <>
              <div className="mt-2">{messageData.text}</div>
            </>
          )}
          {messageData.imageUrl !== "" && messageData.text === "" && (
            <>
              <img
                className="mt-2 message-image"
                src={messageData.imageUrl}
              ></img>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
