import {
  ApolloClient,
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Mention, MentionsInput, SuggestionDataItem } from "react-mentions";
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
  const { loading, error, data, refetch } = useQuery(PostComments, {
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

  const likeHanlder = () => {
    likeCommentMutation({
      variables: {
        commentId: data.postComment?.id,
        userId: UserContext.User.id,
      },
    })
      .then((e) => {
        refetch()
          .then((e) => {
            toastSuccess("Success Like Comment");
            createNotification(
              UserContext.User.id,
              data.PostComment?.Commenter.id,
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
        refetch()
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
          commentId: data.postComment.id,
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
          commenterId: UserContext.User.id,
          comment: commentInput,
          replyToCommentId: commentId,
        },
      })
        .then((e) => {
          UserContext.userRefetch();
          fecthMoreReply({
            updateQuery: (previousResult) => {
              console.log(previousResult);
              console.log(e.data);
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
              console.log(e.data);
              setTotalCommentReply(totalCommentReply + 1);
              setTotalComment(totalComment + 1);
              refetchHashtag();
              createNotification(
                UserContext.User.id,
                data.postComment.Commenter.id,
                "Replied your comment"
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
        console.log(previousResult);
        console.log(fetchMoreResult);
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

  const texts = data.postComment.comment.split(" ");

  const mentionDatas: SuggestionDataItem[] = [];
  UserContext.User.Connections.map((dataMention: any) => {
    let mentionData: SuggestionDataItem = { id: "", display: "" };
    let at: string = "@";
    if (dataMention.user1.id != UserContext.User.id) {
      mentionData.id = dataMention.user1.id;
      mentionData.display = at
        .concat(dataMention.user1.firstName)
        .concat(dataMention.user1.lastName);
      mentionDatas.push(mentionData);
    } else if (dataMention.user2.id != UserContext.User.id) {
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
          console.log(e);
        })
        .catch((e) => {
          toastError(e);
        });
    }
  };

  if (loading && loadingReply) return <p>loading...</p>;
  if (error && errorReply) return <p>Error</p>;

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
            <p className="button-text" onClick={handleReplyShow}>
              Reply
            </p>{" "}
            <p className="text">{totalCommentReply} Replies</p>
          </div>
          <div className="post-bottom-comment-container">
            <div
              style={{ display: `${displayInputComment}` }}
              className="post-comment-input-container"
            >
              <div className="post-comment-input-content">
                {UserContext.User.profileImageUrl === "" ? (
                  <img src="../../src/assets/dummy_avatar.jpg" alt="" />
                ) : (
                  <img src={UserContext.User.profileImageUrl}></img>
                )}
                <MentionsInput
                  onKeyPress={(event) =>
                    pressHandleEnter(event, data.postComment.postId)
                  }
                  value={commentInput}
                  style={{
                    width: "100%",
                    minHeight: "50px",
                    maxHeight: "auto",
                    ...mentionInputCommentStyle,
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
