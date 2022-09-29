import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { AiFillLike, AiOutlineComment, AiOutlineLike } from "react-icons/ai";
import { Mention, MentionsInput, SuggestionDataItem } from "react-mentions";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../lib/UserContext";
import { HashtagRichText1 } from "../model/RichText";
import { AddHashtag } from "../queries/HashtagQueries";
import { AddNotification } from "../queries/NotificationQueries";
import {
  AddComment,
  CommentPost,
  LikePost,
  UnLikePost,
} from "../queries/PostQueries";
import { mentionInputPostStyle, mentionStyle } from "../script/Helper";
import { toastError, toastSuccess } from "../script/Toast";
import PostComment from "./PostComment";
import PosterCard from "./PosterCard";
import RichTextTemplate from "./RichTextTemplate";

const Post = ({
  initialValueTotalComment,
  dataHashtags,
  refetchHashtag,
  postData,
  refectPostData,
}: any) => {
  const UserContext = useUserContext();
  const navigate = useNavigate();
  const [likeMutation] = useMutation(LikePost);
  const [unlikeMutation] = useMutation(UnLikePost);
  const [addCommentMutation] = useMutation(AddComment);
  const [addHashtagMutation] = useMutation(AddHashtag);
  const [inputText, setInputText] = useState("");
  const [
    commentQuery,
    {
      data: dataComment,
      fetchMore: fecthMoreComment,
      loading: loadingComment,
      error: errorComment,
    },
  ] = useLazyQuery(CommentPost);
  const [modalProfilePoster, setModalProfilePoster] = useState(false);
  const [displayInputComment, setDisplayInputComment] = useState("none");
  const [comment, setComment] = useState("");
  const [limit, setLimit] = useState(2);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [shareModal, setShareModal] = useState(false);

  const [totalPostComment, setTotalPostComment] = useState(
    postData.Comments?.length
  );
  const [totalComment, setTotalComment] = useState(initialValueTotalComment);
  const [notificationMutation] = useMutation(AddNotification);

  const likeHandler = () => {
    likeMutation({
      variables: {
        userId: UserContext.user.id,
        postId: postData.id,
      },
    })
      .then((e) => {
        toastSuccess("Like success");
        refectPostData();
        createNotification(
          UserContext.user.id,
          postData.Sender.id,
          "Like your post"
        );
      })
      .catch((e) => {
        toastError(e);
      });
  };

  const unlikeHandler = () => {
    unlikeMutation({
      variables: {
        userId: UserContext.user.id,
        postId: postData.id,
      },
    })
      .then((e) => {
        toastSuccess("Unlike Success");
        refectPostData();
      })
      .catch((error) => {
        toastError(error);
      });
  };

  let checkLike: boolean = false;
  postData.Likes?.map((likeData: any) => {
    if (likeData.userId === UserContext.user.id) {
      checkLike = true;
    }
  });

  function isLike(postData: any) {
    let check = false;
    postData.Likes.forEach((e: any) => {
      if (e.userId === UserContext.user.id) {
        check = true;
      }
    });
    return check;
  }

  const handleGoToProfile = () => {
    navigate(`/profile/${postData.Sender.id}`);
  };

  const handleCommentShow = () => {
    if (displayInputComment == "flex") {
      setDisplayInputComment("none");
      setLimit(2);
      setOffset(0);
    } else {
      setDisplayInputComment("flex");
      commentQuery({
        variables: {
          Limit: limit,
          Offset: offset,
          postId: postData.id,
        },
      })
        .then((e: any) => {
          if (
            e.data === undefined ||
            e.data.postComments.length == 1 ||
            e.data.postComments.length == totalComment
          ) {
            setHasMore(false);
          }
        })
        .catch((e: any) => {
          toastError(e);
        });
    }
  };

  const handleCommentMutation = (e: any, postId: string) => {
    e.preventDefault();

    const texts = inputText?.split(" ");
    texts.map((inputText) => {
      if (inputText.match(HashtagRichText1)) {
        const hashtagSubstring = inputText.substring(1, inputText.length);
        addHashtagMutation({ variables: { hashtag: hashtagSubstring } }).then(
          (e) => {}
        );
      }
    });

    if (comment === "") {
      toastError("Comment cannot be empty!");
    } else {
      addCommentMutation({
        variables: {
          postId: postId,
          commenterId: UserContext.user.id,
          comment: comment,
        },
      })
        .then((e) => {
          UserContext.refetchUser();
          fecthMoreComment({
            updateQuery: (previousResult) => {
              if (!previousResult.postComments) {
                return { postComments: [e.data.addComment] };
              } else {
                return {
                  postComments: [
                    e.data.addComment,
                    ...previousResult.postComments,
                  ],
                };
              }
            },
          })
            .then((e) => {
              toastSuccess("Success add comment");
              setTotalPostComment(totalPostComment + 1);
              setTotalComment(totalComment + 1);
              refetchHashtag();
              createNotification(
                UserContext.user.id,
                postData.Sender.id,
                "Commented On Your Post"
              );
            })
            .catch((e) => {});
          setComment("");
        })
        .catch((e) => {
          toastError(e);
          setComment("");
        });
    }
  };

  const handleFetchMore = () => {
    fecthMoreComment({
      variables: { Offset: dataComment.postComments.length },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (
          previousResult.postComments.length +
            fetchMoreResult.postComments.length ==
          totalComment
        ) {
          setHasMore(false);
        }

        if (fetchMoreResult.postComments.length == 0) {
          return previousResult;
        } else {
          return {
            postComments: [
              ...previousResult.postComments,
              ...fetchMoreResult.postComments,
            ],
          };
        }
      },
    })
      .then((e) => {})
      .catch((e) => {
        setHasMore(false);
      });
  };

  const texts = postData.text?.split(" ");

  const pressHandleEnter = (event: any, postId: string) => {
    if (event.key === "Enter") {
      setComment("");
      handleCommentMutation(event, postId);
    }
  };

  const mentionDatas: SuggestionDataItem[] = [];
  UserContext.user.Connection.map(
    (dataMention: {
      user1: { id: string | number; firstName: string; lastName: string };
      user2: { id: string | number; firstName: string; lastName: string };
    }) => {
      let mentionData: SuggestionDataItem = { id: "", display: "" };
      let at: string = "@";
      if (dataMention.user1.id != UserContext.user.id) {
        mentionData.id = dataMention.user1.id;
        mentionData.display = at
          .concat(dataMention.user1.firstName)
          .concat(dataMention.user1.lastName);
        mentionDatas.push(mentionData);
      } else if (dataMention.user2.id != UserContext.user.id) {
        mentionData.id = dataMention.user2.id;
        mentionData.display = at
          .concat(dataMention.user2.firstName)
          .concat(dataMention.user2.lastName);
        mentionDatas.push(mentionData);
      }
    }
  );

  const hashtagDatas: SuggestionDataItem[] = [];
  dataHashtags.map((dataHashtag: any) => {
    let hashtagData: SuggestionDataItem = { id: "", display: "" };
    let at: string = "#";
    hashtagData.id = at.concat(dataHashtag.id);
    hashtagData.display = at.concat(dataHashtag.hashtag);
    hashtagDatas.push(hashtagData);
  });

  const handleComment = (e: any, newValue: any, newPlainTextValue: any) => {
    setComment(e.target.value);
    setInputText(newPlainTextValue);
  };

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
        .then((e) => {})
        .catch((e) => {});
    }
  };

  const handleShowModal = () => {
    setShareModal(true);
  };

  if (loadingComment) <p>Loading</p>;
  if (errorComment) <p>Error</p>;

  return (
    <div className="mb-6">
      {/* {
                shareModal === true && <SharePostModal postData={postData} setShareModal={setShareModal} />
            } */}
      {/* {modalProfilePoster === true && <PosterCard postData={postData} />} */}

      <div className="post-container rounded-lg sec-profiles">
        <div className="items-center ml-2 w-full">
          <div className="flex-r">
            <div className="mr-2">
              <img
                className="picture-profile cover"
                src={postData.Sender.profile_picture}
              ></img>
            </div>

            <div className="">
              <p
                className="cursor-pointer"
                // onMouseEnter={() => setModalProfilePoster(true)}
                // onMouseLeave={() => setModalProfilePoster(false)}
                onClick={handleGoToProfile}
              >
                {postData.Sender.firstName} {postData.Sender.lastName}
              </p>
              <p className="">{postData.Sender.Follows.length} followers</p>
            </div>
          </div>
          <div className="">
            <div className="">
              <p>
                <RichTextTemplate texts={texts} />
              </p>
            </div>
            <div className="w-full">
              {postData.photoUrl === "" &&
              postData.videoUrl === "" ? null : postData.photoUrl !== "" ? (
                <img className="image-post" src={postData.photoUrl}></img>
              ) : (
                <video
                  className="video-post"
                  src={postData.videoUrl}
                  controls
                />
              )}
            </div>
          </div>
          <div className="mb-4">
            <div className="">
              <p>{postData.Likes.length} Likes</p>
              <p>{totalPostComment} Comment</p>
            </div>
            <div className="">
              {isLike(postData) === false ? (
                <button
                  className="handle-button cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg mr-2"
                  onClick={likeHandler}
                >
                  <AiOutlineLike className="fill-logo"></AiOutlineLike>
                </button>
              ) : (
                <button
                  className="handle-button cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg mr-2"
                  onClick={unlikeHandler}
                >
                  <AiFillLike className="fill-logo"></AiFillLike>
                </button>
              )}

              <button
                className="handle-button cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg"
                onClick={handleCommentShow}
              >
                <AiOutlineComment className="fill-logo"></AiOutlineComment>
              </button>
              {/* <button className="" onClick={handleShowModal}>
                Share
              </button> */}
            </div>
          </div>
          <div className="">
            <div style={{ display: `${displayInputComment}` }} className="">
              <div className="flex comment-container">
                <img
                  src={UserContext.user.profile_picture}
                  className="picture-profile cover mr-2"
                ></img>
                <MentionsInput
                  className="mr-5"
                  onKeyPress={(event: any) =>
                    pressHandleEnter(event, postData.id)
                  }
                  value={comment}
                  style={{
                    width: "100%",
                    maxwidth: "100%",
                    minHeight: "50px",
                    maxHeight: "auto",
                    ...mentionInputPostStyle,
                  }}
                  placeholder="Add a comment..."
                  onChange={handleComment}
                >
                  <Mention
                    trigger="@"
                    data={mentionDatas}
                    style={mentionStyle}
                  />
                  <Mention
                    trigger="#"
                    data={hashtagDatas}
                    style={mentionStyle}
                  />
                </MentionsInput>
              </div>
            </div>
            {displayInputComment === "flex" &&
              dataComment?.postComments?.map((commentTypeData: any) => {
                return (
                  <PostComment
                    key={commentTypeData.id}
                    dataHashtags={dataHashtags}
                    refetchHashtag={refetchHashtag}
                    commentId={commentTypeData.id}
                    commentReply={commentTypeData.Replies}
                    totalComment={totalPostComment}
                    setTotalComment={setTotalPostComment}
                  />
                );
              })}
            {displayInputComment === "flex" && hasMore == true && (
              <div className="mb-3">
                <button
                  className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg"
                  onClick={handleFetchMore}
                >
                  Load more comment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
