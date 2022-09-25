import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useUserContext } from "../lib/UserContext";
import { AddNotification } from "../queries/NotificationQueries";
import {
  AddLikeComment,
  DeleteLikeComment,
  PostComments,
} from "../queries/PostQueries";
import { toastSuccess, toastError } from "../script/Toast";
import RichTextTemplateHome from "./RichTextTemplateHome";

const PostReply = ({ replyId }: { replyId: string }) => {
  const UserContext = useUserContext();
  const [likeCommentMutation] = useMutation(AddLikeComment);
  const [unLikeCommentMutation] = useMutation(DeleteLikeComment);
  const [notificationMutation] = useMutation(AddNotification);

  const {
    loading,
    error,
    data,
    refetch: refectReply,
  } = useQuery(PostComments, { variables: { id: replyId } });
  let checkUserLikes: boolean = false;

  if (loading) return <p>loading...</p>;

  const likeHanlder = () => {
    likeCommentMutation({
      variables: {
        commentId: data.postComment?.id,
        userId: UserContext.User.id,
      },
    })
      .then((e) => {
        refectReply()
          .then((e) => {
            toastSuccess("Success Like Comment");
            createNotification(
              UserContext.User.id,
              data.postComment?.Commenter.id,
              "Like your comment"
            );
          })
          .catch((e) => {
            toastError(e);
          });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  const unlikehanlder = () => {
    unLikeCommentMutation({
      variables: {
        commentId: data.postComment?.id,
        userId: UserContext.User.id,
      },
    })
      .then((e) => {
        refectReply()
          .then((e) => {
            toastSuccess("Success Unlike Comment");
          })
          .catch((e) => {
            toastError(e);
          });
      })
      .catch((e) => {
        toastError(e);
      });
  };

  data.postComment.Likes.map((dataLikes: any) => {
    if (dataLikes.User.id === UserContext.User.id) {
      checkUserLikes = true;
    }
  });

  const texts = data.postComment.comment.split(" ");
  const createNotification = (
    fromUserId: string,
    toUserId: string,
    message: string
  ) => {
    if (fromUserId != toUserId) {
      notificationMutation({
        variables: {
          toUserId: toUserId,
          fromUserId: fromUserId,
          message: message,
        },
      })
        .then((e) => {
          console.log(e);
        })
        .catch((e) => {
          toastError(e);
        });
    }
  };
  return (
    <div className="post-comment-container">
      <div className="post-comment-content-continer">
        <div className="content-left">
          {data.postComment.Commenter.profileImageUrl ? (
            <img
              src={data.postComment?.Commenter.profileImageUrl}
              className="profile"
              alt=""
            />
          ) : (
            <img
              src="../../src/assets/dummy_avatar.jpg"
              className="profile"
              alt=""
            />
          )}
        </div>
        <div className="content-right">
          <div className="content">
            <p className="name">
              {data.postComment?.Commenter.firstName}{" "}
              {data.postComment?.Commenter.lastName}
            </p>
            <p className="headline">{data.postComment?.Commenter.headline}</p>
            <p className="text">
              <RichTextTemplateHome texts={texts} />
            </p>
          </div>
          <div className="button-comment-container">
            {checkUserLikes === false ? (
              <>
                <p className="button-text" onClick={likeHanlder}>
                  Like
                </p>{" "}
                <p className="text">{data.postComment?.Likes.length} Likes</p>
              </>
            ) : (
              <>
                <p className="button-text" onClick={unlikehanlder}>
                  Unlike
                </p>{" "}
                <p className="text">{data.postComment?.Likes.length} Likes</p>
              </>
            )}
            <p className="button-text">Reply</p>{" "}
            <p className="text">{data.postComment?.Replies.length} Replies</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostReply;
