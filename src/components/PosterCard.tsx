import React from "react";

const PosterCard = ({ postData }: { postData: any }) => {
  return (
    <div className="relative">
      <div className="poster-card-container">
        <div className="">
          <img
            className="picture-profile2"
            src={postData.Sender.profile_picture}
          />
        </div>
        <div className="">
          <div className="">
            {postData.Sender.firstName} {postData.Sender.lastName}
          </div>
          <div className="">
            {postData.Sender.about}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;
