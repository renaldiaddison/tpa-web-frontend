import { useQuery } from "@apollo/client";
import React from "react";
import { GetUserById } from "../queries/UserQueries";

const MentionModal = ({ userId }: any) => {
  const { loading, error, data } = useQuery(GetUserById, {
    variables: { id: userId },
  });

  console.log(userId);

  if (loading) {
    return (
      <div className="modal-mention-container">
        <p>Loading...</p>
      </div>
    );
  } else {
    console.log(data);

    return (
      <div className="modal-mention-container">
        <div className="modal-mention-content-container">
          <div className="modal-mention-left-content">
            <img src={data.getUserById.profile_picture}></img>
          </div>
          <div className="modal-mention-right-content">
            <p className="modal-mention-username">
              {data.getUserById.firstName} {data.getUserById.lastName}
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default MentionModal;
