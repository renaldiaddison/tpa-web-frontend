import React from "react";

const UserSuggestionCard = ({ userSuggestionData }: any) => {
  return (
    // <div className="suggest-card scale-0">
    //   <img
    //     src={userSuggestionData.profile_picture}
    //     className="profile-picture cover m-profile white-bg"
    //   ></img>
    //   <div className="info">
    //     <h1>
    //       {userSuggestionData.firstName + " " + userSuggestionData.lastName}
    //     </h1>
    //   </div>
    // </div>

    // <div className="card">
    //   <div className="flex relative w-full m-desc">
    //     <img
    //       src={userSuggestionData.profile_picture}
    //       className="picture-user-suggest cover"
    //     ></img>
    //     <div className="w-full">
    //       <div className="flex-c user-profile">
    //         <p className="text-black">
    //           {userSuggestionData.firstName +
    //             " " +
    //             userSuggestionData.lastName +
    //             " " +
    //             userSuggestionData.additionalName}
    //         </p>
    //         <button>Request Connect</button>
    //       </div>
    //     </div>
    //     <div className="py-5 pr-1 close"></div>
    //   </div>
    // </div>
    <div className="container">
      <div className="card-suggest">
        <img
          src={userSuggestionData.profile_picture}
          className="suggest-img"
        ></img>
        <div className="info">
          <h1>
            {userSuggestionData.firstName +
              " " +
              userSuggestionData.lastName +
              " " +
              userSuggestionData.additionalName}
          </h1>
          <p>{userSuggestionData.about}</p>
          <div className="links">
            <a href="#">Download Cv</a>
            <a>Send Message</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSuggestionCard;
