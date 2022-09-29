import { NetworkStatus, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Filter from "../components/Filter";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import UserConnectionCard from "../components/UserConnectionCard";
import UserConnectRequestCard from "../components/UserConnectRequestCard";
import UserSearchCard from "../components/UserSearchCard";
import { useUserContext } from "../lib/UserContext";
import { Hashtags } from "../queries/HashtagQueries";
import { Search, SearchPost, SearchUser } from "../queries/SearchQueries";
import "../styles/css-library.scss";
import "../styles/search.scss";

const SearchPage = () => {
  const UserContext = useUserContext();
  const p = useParams();
  const [filter, setFilter] = useState("");
  const [hasMorePost, setHasMorePost] = useState(true);
  const [hasMoreUser, setHasMoreUser] = useState(true);
  const [displayInputComment, setDisplayInputComment] = useState("hidden");

  useEffect(() => {
    if (hasMoreUser) {
      setDisplayInputComment("flex");
    } else {
      setDisplayInputComment("hidden");
    }
  });

  const {
    loading: loadingSearch,
    data: dataSearch,
    error: errorSearch,
    refetch: refetchSearch,
  } = useQuery(Search, {
    variables: { Keyword: p.text},
  });

  const {
    loading: loadingHashtag,
    data: dataHashtag,
    error: errorHashtag,
    refetch: refetchHashtag,
  } = useQuery(Hashtags);

  const {
    loading: loadingPost,
    error: errorPost,
    data: dataPost,
    fetchMore: fetchMorePost,
    refetch: refetchPost,
    networkStatus: networkStatusPost,
  } = useQuery(SearchPost, {
    variables: { Keyword: p.text, Limit: 1, Offset: 0 },
    notifyOnNetworkStatusChange: true,
  });

  const {
    loading: loadingUser,
    error: errorUser,
    data: dataUser,
    fetchMore: fetchMoreUser,
    refetch: refetchUser,
    networkStatus: networkStatusUser,
  } = useQuery(SearchUser, {
    variables: { Keyword: p.text, Limit: 2, Offset: 0 },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    UserContext.refetchUser();
    refetchPost();
    refetchUser();
  }, []);

  if (!dataUser || !dataPost || !dataSearch || !dataHashtag)
    return <p>loading</p>;
  if (errorPost || errorUser || errorSearch || errorHashtag)
    return <p>error</p>;

  window.onscroll = () => {
    if (window.innerHeight + window.scrollY > document.body.offsetHeight) {
      if (hasMorePost && networkStatusPost !== NetworkStatus.fetchMore) {
        fetchMorePost({
          variables: { Offset: dataPost.SearchPost.Posts.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (fetchMoreResult.SearchPost.Posts.length === 0) {
              setHasMorePost(false);
              return previousResult;
            } else {
              setHasMorePost(true);
              return {
                SearchPost: {
                  Posts: [
                    ...previousResult.SearchPost.Posts,
                    ...fetchMoreResult.SearchPost.Posts,
                  ],
                },
              };
            }
          },
        });
      }
    }
  };

  const handleLoadMoreUser = () => {
    fetchMoreUser({
      variables: { Offset: dataUser.SearchUser.Users.length },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (
          fetchMoreResult.SearchUser.Users.length +
            previousResult.SearchUser.Users.length ===
          dataSearch.Search.Users.length
        ) {
          setHasMoreUser(false);
        }

        if (fetchMoreResult.SearchUser.Users.length === 0) {
          return previousResult;
        } else {
          return {
            SearchUser: {
              Users: [
                ...previousResult.SearchUser.Users,
                ...fetchMoreResult.SearchUser.Users,
              ],
            },
          };
        }
      },
    });
  };
  return (
    <div className="white-bg center-col">
      <Navbar></Navbar>
      <Filter setFilter={setFilter}></Filter>

      {filter === "Post" ? null : (
        <div className="sec-profile white-bg">
          <div className="flex-r w-full justify-between">
            <p className="text-black text-l bold m-profile">Users</p>
          </div>
          {dataUser.SearchUser.Users.length === 0 && (
            <>
              <p className="text-black text-s w-full m-desc">-</p>
              <div className="m-20px"></div>
            </>
          )}
          {dataUser.SearchUser.Users.map((user: any) => {
            return (
              <UserSearchCard
                key={user.id}
                user={user}
                refetchUser={refetchUser}
              />
            );
          })}

          {dataUser.SearchUser.Users.length !== 0 && displayInputComment === "flex" && hasMoreUser == true && (
            <div className="mb-3 ml-5">
              <button
                className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg"
                onClick={handleLoadMoreUser}
              >
                Load more user
              </button>
            </div>
          )}
        </div>
      )}

      {filter === "User" ? null : (
        <div className="sec-profile white-bg post-search-container">
          <div className="flex-r w-full justify-between">
            <p className="text-black text-l bold m-profile">Posts</p>
          </div>
          {dataPost.SearchPost.Posts.length === 0 && (
            <>
              <p className="text-black text-s w-full m-desc">-</p>
              <div className="m-20px"></div>
            </>
          )}
          {dataPost.SearchPost.Posts.map((post: any) => {
            let initialValueTotalComment = post.Comments.length;
            post.Comments.map((comment: any) => {
              initialValueTotalComment -= comment.Replies.length;
            });

            return (
              <Post
                initialValueTotalComment={initialValueTotalComment}
                dataHashtags={dataHashtag.Hashtags}
                refetchHashtag={refetchHashtag}
                postData={post}
                refectPostData={refetchPost}
                key={post.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
