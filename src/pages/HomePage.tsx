import { useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { UserContext, useUserContext } from "../lib/UserContext";
import "../styles/home.scss";
import "../styles/css-library.scss";
import CreatePostModal from "../components/CreatePostModal";
import { Posts } from "../queries/PostQueries";
import { Hashtags } from "../queries/HashtagQueries";
import { InfinitySpin } from "react-loader-spinner";
import Post from "../components/Post";

const HomePage = () => {
  const UserContext = useUserContext();
  const [postModal, setPostModal] = useState(false);
  const [hasMorePost, setHasMorePost] = useState(true);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const {
    loading: loadingHashtag,
    data: dataHashtag,
    error: errorHashtag,
    refetch: refetchHashtag,
  } = useQuery(Hashtags);
  const {
    loading,
    error,
    data,
    refetch: refetchPost,
    fetchMore,
    networkStatus,
  } = useQuery(Posts, {
    variables: {
      Limit: 5,
      Offset: 0,
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    refetchPost();
  }, []);

  if (loading || loadingHashtag) return <p>loading</p>;
  if (error || errorHashtag) return <p>error</p>;

  window.onscroll = () => {
    if (window.innerHeight + window.scrollY > document.body.offsetHeight) {
      if (hasMorePost && networkStatus !== 3) {
        fetchMore({
          variables: { Offset: data.Posts.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            console.log(previousResult);
            console.log(fetchMoreResult);

            if (!fetchMoreResult.Posts.length) setHasMorePost(false);
            else setHasMorePost(true);

            let check = false;

            for (let index = 0; index < previousResult.Posts.length; index++) {
              for (
                let index2 = 0;
                index2 < fetchMoreResult.Posts.length;
                index2++
              ) {
                if (
                  previousResult.Posts[index].id ===
                  fetchMoreResult.Posts[index2].id
                ) {
                  check = true;
                }
              }
            }

            console.log(check);

            if (check === true) {
              return previousResult;
            } else {
              return {
                Posts: [...previousResult.Posts, ...fetchMoreResult.Posts],
              };
            }
          },
        });
      }
    }
  };

  return (
    <div className="white-bg center-col">
      <Navbar></Navbar>
      {postModal && (
        <CreatePostModal
          closeModal={setPostModal}
          refetchPost={refetchPost}
          refetchHashtag={refetchHashtag}
          dataHashtag={dataHashtag.Hashtags}
          fetchMorePost={fetchMore}
        ></CreatePostModal>
      )}

      <div className="big-container flex flex-col">
        <div className="items-center">
          <button
            onClick={() => setPostModal(true)}
            className="add_button cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
          >
            Create new post
          </button>
        </div>

        <div>
          <div className="">
            {data.Posts.map((post: any) => {
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
        </div>

        {networkStatus === 3 && <InfinitySpin width="200" color="#3B82F6" />}
      </div>

      <Footer></Footer>
    </div>
  );
};

export default HomePage;
