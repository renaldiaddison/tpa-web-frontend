import {
  ApolloClient,
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import React, { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BsFillReplyFill } from "react-icons/bs";
import { Mention, MentionsInput, SuggestionDataItem } from "react-mentions";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../lib/UserContext";
import { HashtagRichText1 } from "../model/RichText";
import { AddHashtag } from "../queries/HashtagQueries";
import { AddNotification } from "../queries/NotificationQueries";
import {
  AddLikeComment,
  AddReply,
  DeleteLikeComment,
  PostComments,
  RepliedToComments,
} from "../queries/PostQueries";
import { mentionInputCommentStyle, mentionStyle } from "../script/Helper";
import { toastError, toastSuccess } from "../script/Toast";
import PostReply from "./PostReply";
import RichTextTemplateHome from "./RichTextTemplateHome";

const PostComment = ({
  commentId,
  commentReply,
  totalComment,
  setTotalComment,
  dataHashtags,
  refetchHashtag,
}: any) => {
  const UserContext = useUserContext();
  const client = useApolloClient();
  const [likeCommentMutation] = useMutation(AddLikeComment);
  const [unLikeCommentMutation] = useMutation(DeleteLikeComment);
  const [displayInputComment, setDisplayInputComment] = useState("none");
  const navigate = useNavigate();

  const {
    loading: loadingComment,
    error: errorComment,
    data: dataComment,
    refetch: refetchComment,
  } = useQuery(PostComments, {
    variables: { id: commentId },
  });

  const [addReplyMutation] = useMutation(AddReply);
  const [
    replyQuery,
    {
      data: dataReply,
      fetchMore: fecthMoreReply,
      loading: loadingReply,
      error: errorReply,
    },
  ] = useLazyQuery(RepliedToComments);

  const [commentInput, setCommentInput] = useState("");
  const [limit, setLimit] = useState(2);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCommentReply, setTotalCommentReply] = useState(
    commentReply.length
  );
  const [notificationMutation] = useMutation(AddNotification);

  const [addHashtagMutation] = useMutation(AddHashtag);
  const [inputText, setInputText] = useState("");

  let checkUserLikes: boolean = false;

  if (loadingComment || loadingReply) return <p>loading...</p>;
  if (errorComment || errorReply) return <p>Error</p>;

  const likeHandler = () => {
    likeCommentMutation({
      variables: {
        commentId: dataComment.postComment?.id,
        userId: UserContext.user.id,
      },
    })
      .then((e) => {
        refetchComment()
          .then((e) => {
            toastSuccess("Success Like Comment");
            createNotification(
              UserContext.user.id,
              dataComment.postComment.Commenter.id,
              "Like Your Comment"
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
        commentId: dataComment.postComment?.id,
        userId: UserContext.user.id,
      },
    })
      .then((e) => {
        refetchComment()
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

  dataComment.postComment.Likes.map((dataLikes: any) => {
    if (dataLikes.User.id === UserContext.user.id) {
      checkUserLikes = true;
    }
  });

  const handleReplyShow = () => {
    if (displayInputComment == "flex") {
      setDisplayInputComment("none");
      setLimit(2);
      setOffset(0);
    } else {
      setDisplayInputComment("flex");
      replyQuery({
        variables: {
          Limit: limit,
          Offset: offset,
          commentId: dataComment.postComment.id,
        },
      })
        .then((e) => {
          if (
            e.data === undefined ||
            e.data.repliedToComments.length == 1 ||
            e.data.repliedToComments.length == commentReply.length
          ) {
            setHasMore(false);
          }
        })
        .catch((e) => {
          toastError(e);
        });
    }
  };

  const handleCommentMutation = (e: any, postId: string) => {
    e.preventDefault();

    const texts = inputText.split(" ");
    texts.map((inputText) => {
      if (inputText.match(HashtagRichText1)) {
        const hashtagSubstring = inputText.substring(1, inputText.length);
        addHashtagMutation({ variables: { hashtag: hashtagSubstring } }).then(
          (e) => {
            console.log(e);
          }
        );
      }
    });

    if (commentInput === "") {
      toastError("Comment cannot be empty!");
    } else {
      addReplyMutation({
        variables: {
          postId: postId,
          commenterId: UserContext.user.id,
          comment: commentInput,
          replyToCommentId: commentId,
        },
      })
        .then((e) => {
          UserContext.refetchUser();
          fecthMoreReply({
            updateQuery: (previousResult) => {
              if (!previousResult.repliedToComments) {
                return { repliedToComments: [e.data.addReply] };
              } else {
                return {
                  repliedToComments: [
                    e.data.addReply,
                    ...previousResult.repliedToComments,
                  ],
                };
              }
            },
          })
            .then((e) => {
              toastSuccess("Success add reply");
              setTotalCommentReply(totalCommentReply + 1);
              setTotalComment(totalComment + 1);
              refetchHashtag();
              createNotification(
                UserContext.user.id,
                dataComment.postComment.Commenter.id,
                "Replied Your Comment"
              );
            })
            .catch((e) => {
              console.log(e);
            });
          setCommentInput("");
        })
        .catch((e) => {
          toastError(e);
          setCommentInput("");
        });
    }
  };

  const handleFetchMore = () => {
    fecthMoreReply({
      variables: { Offset: dataReply.repliedToComments.length },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        let check = false;
        if (!fetchMoreResult.repliedToComments) return previousResult;
        if (
          previousResult.repliedToComments.length +
            fetchMoreResult.repliedToComments.length ==
          totalCommentReply
        ) {
          setHasMore(false);
        }

        for (
          let index = 0;
          index < previousResult.repliedToComments.length;
          index++
        ) {
          for (
            let index2 = 0;
            index2 < fetchMoreResult.repliedToComments.length;
            index2++
          ) {
            if (
              previousResult.repliedToComments[index].id ===
              fetchMoreResult.repliedToComments[index2].id
            ) {
              check = true;
            }
          }
        }

        if (check === true || fetchMoreResult.repliedToComments.length == 0) {
          return previousResult;
        } else {
          return {
            repliedToComments: [
              ...previousResult.repliedToComments,
              ...fetchMoreResult.repliedToComments,
            ],
          };
        }
      },
    })
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        setHasMore(false);
        console.log(e);
      });
  };

  const texts = dataComment.postComment.comment.split(" ");

  const mentionDatas: SuggestionDataItem[] = [];
  UserContext.user.Connection.map((dataMention: any) => {
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
  });

  const hashtagDatas: SuggestionDataItem[] = [];
  dataHashtags.map((dataHashtag: any) => {
    let hashtagData: SuggestionDataItem = { id: "", display: "" };
    let at: string = "#";
    hashtagData.id = at.concat(dataHashtag.id);
    hashtagData.display = at.concat(dataHashtag.hashtag);
    hashtagDatas.push(hashtagData);
  });

  const pressHandleEnter = (event: any, postId: string) => {
    console.log(event.key);
    if (event.key === "Enter") {
      setCommentInput("");
      handleCommentMutation(event, postId);
    }
  };

  const handleComment = (e: any, newValue: any, newPlainTextValue: any) => {
    setCommentInput(e.target.value);
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
        .then((e) => {
          // toastSuccess("success");
        })
        .catch((e) => {
          toastError("err");
        });
    }
  };

  const handleGoToProfile = () => {
    navigate(`/profile/${dataComment.postComment.Commenter.id}`);
  };
  return (
    <div className="">
      <div className="flex">
        <div className="mr-2">
          <img
            src={dataComment.postComment?.Commenter.profile_picture}
            className="picture-profile2 cover"
            alt=""
          />
        </div>
        <div className="w-full comment-content">
          <div>
            <p onClick={handleGoToProfile} className="cursor-pointer">
              {dataComment.postComment?.Commenter.firstName}{" "}
              {dataComment.postComment?.Commenter.lastName}
            </p>
            <p>
              <RichTextTemplateHome texts={texts} />
            </p>
          </div>
          <div className="flex button-comment">
            {checkUserLikes === false ? (
              <div className="flex items-center mr-2">
                <p className="cursor-pointer" onClick={likeHandler}>
                  <AiOutlineLike className="fill-logo"></AiOutlineLike>
                </p>{" "}
                <p className="text">{dataComment.postComment?.Likes.length}</p>
              </div>
            ) : (
              <div className="flex items-center mr-2">
                <p className="cursor-pointer" onClick={unlikeHandler}>
                  <AiFillLike className="fill-logo"></AiFillLike>
                </p>{" "}
                <p className="text">{dataComment.postComment?.Likes.length}</p>
              </div>
            )}
            <div className="flex items-center">
              <p className="cursor-pointer" onClick={handleReplyShow}>
                <BsFillReplyFill className="fill-logo"></BsFillReplyFill>
              </p>{" "}
              <p className="text">{totalCommentReply}</p>
            </div>
          </div>
          <div className="">
            <div style={{ display: `${displayInputComment}` }} className="">
              <div className="flex comment-container">
                <img
                  className="picture-profile2 cover mr-2"
                  src={UserContext.user.profile_picture}
                ></img>
                <MentionsInput
                  className="mr-5"
                  onKeyPress={(event) =>
                    pressHandleEnter(event, dataComment.postComment.postId)
                  }
                  value={commentInput}
                  style={{
                    width: "100%",
                    minHeight: "50px",
                    maxHeight: "auto",
                    ...mentionInputCommentStyle,
                  }}
                  placeholder="Add a reply..."
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
              <div></div>
            </div>
            {displayInputComment === "flex" &&
              dataReply.repliedToComments?.map((replyData: any) => {
                return <PostReply key={replyData.id} replyId={replyData.id} />;
              })}
            {displayInputComment === "flex" && hasMore == true && (
              <div className="button-comment-container">
                <button className="button-load-more" onClick={handleFetchMore}>
                  Load more reply
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComment;
