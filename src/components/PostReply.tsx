import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BsFillReplyFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const {
    loading,
    error,
    data,
    refetch: refectReply,
  } = useQuery(PostComments, { variables: { id: replyId } });
  let checkUserLikes: boolean = false;

  if (loading) return <p>loading...</p>;
  if (error) return <p>Error...</p>;

  const likeHandler = () => {
    likeCommentMutation({
      variables: {
        commentId: data.postComment?.id,
        userId: UserContext.user.id,
      },
    })
      .then((e) => {
        refectReply()
          .then((e) => {
            toastSuccess("Success Like Reply");
            createNotification(
              UserContext.user.id,
              data.postComment?.Commenter.id,
              "Like Your Reply"
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

  const unlikeHandler = () => {
    unLikeCommentMutation({
      variables: {
        commentId: data.postComment?.id,
        userId: UserContext.user.id,
      },
    })
      .then((e) => {
        refectReply()
          .then((e) => {
            toastSuccess("Success Unlike Reply");
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
    if (dataLikes.User.id === UserContext.user.id) {
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

  const handleGoToProfile = () => {
    navigate(`/profile/${data.postComment.Commenter.id}`);
  };
  return (
    <div className="">
      <div className="flex">
        <div className="mr-2">
          <img
            src={data.postComment?.Commenter.profile_picture}
            className="picture-profile2 cover"
            alt=""
          />
        </div>
        <div className="w-full comment-content">
          <div className="">
            <p onClick={handleGoToProfile} className="cursor-pointer">
              {data.postComment?.Commenter.firstName}{" "}
              {data.postComment?.Commenter.lastName}
            </p>
            <p className="">{data.postComment?.Commenter.headline}</p>
            <p className="">
              <RichTextTemplateHome texts={texts} />
            </p>
          </div>
          <div className="flex button-comment">
            {checkUserLikes === false ? (
              <div className="flex items-center mr-2">
                <p className="cursor-pointer" onClick={likeHandler}>
                  <AiOutlineLike className="fill-logo"></AiOutlineLike>
                </p>{" "}
                <p className="text">{data.postComment?.Likes.length}</p>
              </div>
            ) : (
              <div className="flex items-center mr-2">
                <p className="cursor-pointer" onClick={unlikeHandler}>
                  <AiFillLike className="fill-logo"></AiFillLike>
                </p>{" "}
                <p className="text">{data.postComment?.Likes.length}</p>
              </div>
            )}
            {/* <p className="">Reply</p>{" "}
            <p className="">{data.postComment?.Replies.length} Replies</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostReply;
