import React from "react";
import UserSuggestionCard from "./UserSuggestionCard";

const UserSuggestionProfile = ({
  userSuggestionData,
  refetchUserSuggestion,
}: any) => {
  return (
    <div className="big-container">
      {userSuggestionData.map((suggestionData: any) => {
        return (
          <UserSuggestionCard
            key={suggestionData.id}
            userSuggestionData={suggestionData}
            refetchUserSuggestion={refetchUserSuggestion}
          />
        );
      })}
    </div>
  );
};

export default UserSuggestionProfile;
