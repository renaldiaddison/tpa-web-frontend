import React from "react";
import UserSuggestionCard from "./UserSuggestionCard";

const UserSuggestionProfile = ({ userSuggestionData }: any) => {
  console.log(userSuggestionData);
  return (
    <div className=""> 
      {userSuggestionData.map((suggestionData: any) => {
        return (
          <UserSuggestionCard
            key={suggestionData.id}
            userSuggestionData={suggestionData}
          />
        );
      })}
    </div>
  );
};

export default UserSuggestionProfile;
