import { useQuery } from "@apollo/client";
import React from "react";
import { GetUserById } from "../queries/UserQueries";

const MentionModal = ({ userId }: any) => {
  const { loading, error, data } = useQuery(GetUserById, {
    variables: { id: userId },
  });

  if (loading) <p>Loading</p>;
  if (error) <p>Error</p>;

  return (
    <div className="modal-mention-container">
      <div className="modal-mention-content-container">
        <div className="modal-mention-left-content">
          {data.getUserById.profileImageUrl === "" ? (
            <img src="../../src/assets/dummy_avatar.jpg" alt="" />
          ) : (
            <img src={data.getUserById.profileImageUrl}></img>
          )}
        </div>
        <div className="modal-mention-right-content">
          <p className="modal-mention-username">
            {data.getUserById.firstName} {data.getUserById.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentionModal;
