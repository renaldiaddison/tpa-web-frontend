import { useMutation } from "@apollo/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { storage } from "../config/firebase-config";
import { useUserContext } from "../lib/UserContext";
import { HashtagRichText1, HashtagRichText2 } from "../model/RichText";
import { AddHashtag } from "../queries/HashtagQueries";
import { CreatePost } from "../queries/PostQueries";
import { toastError } from "../script/Toast";
import { MentionsInput, Mention, SuggestionDataItem } from "react-mentions";
import { AiFillPicture, AiFillYoutube } from "react-icons/ai";
import { mentionInputPostStyle, mentionStyle } from "../script/Helper";
import { BsFillCameraVideoFill } from "react-icons/bs";

const CreatePostModal = ({
  closeModal,
  refetchPost,
  fetchMorePost,
  refetchHashtag,
  dataHashtag,
}: any) => {
  const UserContext = useUserContext();
  const [text, setText] = useState("");
  const [inputText, setInputText] = useState("");
  const [mutationPost] = useMutation(CreatePost);
  const [file, setFile] = useState<File>();
  const [buttonDisable, setButtonDisable] = useState(true);
  const [removeFileStyle, setRemoveFileStyle] = useState("hidden");
  const [addHashtagMutation] = useMutation(AddHashtag);

  const [localUrl, setLocalUrl] = useState({
    type: "",
    url: "",
  });

  const changeFileHandler = (e: any, typeInput: string) => {
    const urlFile = URL.createObjectURL(e.target.files[0]);
    let type = e.target.files[0].type;
    let splitType = type.split("/");

    if (typeInput === splitType[0]) {
      setLocalUrl({
        type: typeInput,
        url: urlFile,
      });
      showRemoveAttachmentFile();
      setFile((e.target.files as FileList)[0] as File);
    } else {
      toastError("Invalid file type");
    }
  };

  const uploadHandler = async () => {
    let url = "";

    if (file !== undefined) {
      const refStorage = ref(
        storage,
        `${UserContext.user.email}/${(file as File).name}`
      );
      await uploadBytes(refStorage, file as File, {
        contentType: "profile pic",
      });
      url = await getDownloadURL(refStorage);
      postHandler(url);
      closeModal(false);
    } else {
      postHandler("");
      closeModal(false);
    }
  };

  const postHandler = (url: string) => {
    const texts = inputText.split(" ");
    texts.map((inputText) => {
      if (
        inputText.match(HashtagRichText1) &&
        !inputText.match(HashtagRichText2)
      ) {
        const hashtagSubstring = inputText.substring(1, inputText.length);
        console.log(hashtagSubstring);
        addHashtagMutation({ variables: { hashtag: hashtagSubstring } }).then(
          (e) => {}
        );
      }
    });

    if (localUrl.type === "image") {
      mutationPost({
        variables: {
          senderId: UserContext.user.id,
          text: inputText,
          photoUrl: url,
          videoUrl: "",
        },
      })
        .then((e) => {
          refetchHashtag();
          fetchMorePost({
            updateQuery: (previousResult: any) => {
              if (!previousResult.Posts) {
                return { Posts: [e.data.CreatePost] };
              } else {
                return { Posts: [e.data.CreatePost, ...previousResult.Posts] };
              }
            },
          });
        })
        .catch((e) => {
          toastError(e);
        });
    } else {
      mutationPost({
        variables: {
          senderId: UserContext.user.id,
          text: inputText,
          photoUrl: "",
          videoUrl: url,
        },
      })
        .then((e) => {
          refetchHashtag();
          fetchMorePost({
            updateQuery: (previousResult: any) => {
              if (!previousResult.Posts) {
                return { Posts: [e.data.CreatePost] };
              } else {
                return { Posts: [e.data.CreatePost, ...previousResult.Posts] };
              }
            },
          });
        })
        .catch((e) => {
          toastError(e);
        });
    }
  };

  const removeFileHandler = () => {
    setLocalUrl({ type: "", url: "" });
    setFile(undefined);
  };

  const showRemoveAttachmentFile = () => {
    if (localUrl.url === "") {
      setRemoveFileStyle("hidden");
    } else {
      setRemoveFileStyle("block");
    }
  };

  useEffect(() => {
    showRemoveAttachmentFile();
  }, [localUrl.url]);

  useEffect(() => {
    if (text === "") {
      setButtonDisable(true);
    } else {
      setButtonDisable(false);
    }
  }, [text]);

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
  dataHashtag.map((hashtag: any) => {
    let hashtagData: SuggestionDataItem = { id: "", display: "" };
    let at: string = "#";
    hashtagData.id = at.concat(hashtag.id);
    hashtagData.display = at.concat(hashtag.hashtag);
    hashtagDatas.push(hashtagData);
  });

  const handleComment = (e: any, newValue: any) => {
    setText(e.target.value);
    setInputText(newValue);
  };

  return (
    <div className="modal-bg">
      <div className="modal relative">
        <button
          type="button"
          className="close"
          data-modal-toggle="authentication-modal"
          onClick={() => closeModal(false)}
        >
          <svg
            className="w-5 h-5"
            fill="gray"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <h3>Create a post</h3>
        <div className="">
          <div className="">
            {localUrl.url === "" ? null : localUrl.type === "image" ? (
              <img src={localUrl.url} className="w-full" alt="" />
            ) : (
              <video src={localUrl.url} className="w-full"></video>
            )}
            <MentionsInput
              id="test-rich-text"
              value={text}
              style={{
                width: "100%",
                height: "150px",
                ...mentionInputPostStyle,
              }}
              placeholder="What do you want to talk about?"
              onChange={handleComment}
            >
              <Mention trigger="@" data={mentionDatas} style={mentionStyle} />
              <Mention trigger="#" data={hashtagDatas} style={mentionStyle} />
            </MentionsInput>
          </div>
          <div className="w-full mt-2">
            <div className="flex">
              <div className="mr-2">
                <label htmlFor="video-input" className="video">
                  <AiFillPicture size={30} />
                </label>

                <input
                  id="video-input"
                  type="file"
                  onChange={(e) => changeFileHandler(e, "image")}
                  style={{ display: "none" }}
                />
              </div>
              <div className="">
                <label htmlFor="file-input" className="photo">
                  <BsFillCameraVideoFill size={30} />
                </label>

                <input
                  id="file-input"
                  type="file"
                  onChange={(e) => changeFileHandler(e, "video")}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="w-full flex-r mt-1">
              <button
                className="cursor-pointer bg-blue-500 border-blue-500 button-style font-bold rounded-lg text-white px-5 py-1  mr-2 "
                disabled={buttonDisable}
                onClick={uploadHandler}
              >
                Post
              </button>
              <button
                className={`cursor-pointer bg-red-500 border-red-500 button-red-style text-white font-bold rounded-lg px-5 py-1 ${removeFileStyle}`}
                onClick={removeFileHandler}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
