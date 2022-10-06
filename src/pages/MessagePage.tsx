import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { BiMessageAdd } from "react-icons/bi";
import { Route, Routes, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import MessageList from "../components/MessageList";
import MessageNew from "../components/MessageNew";
import MessageRoom from "../components/MessageRoom";
import Navbar from "../components/Navbar";
import { useUserContext } from "../lib/UserContext";
import { Rooms } from "../queries/MessageQueries";
import { Blocks } from "../queries/UserQueries";
import "../styles/message.scss";

const MessagePage = () => {
  const navigate = useNavigate();
  const UserContext = useUserContext();
  const [modalNew, setModalNew] = useState(false);

  const { loading, error, data, startPolling } = useQuery(Rooms, {
    variables: { userId: UserContext.user.id },
  });
  const {
    loading: loadingBLock,
    data: dataBlock,
    startPolling: startPollingBlock,
  } = useQuery(Blocks, { variables: { userId: UserContext.user.id } });

  useEffect(() => {
    startPolling(500);
    startPollingBlock(500);
  }, []);

  useEffect(() => {
    UserContext.refetchUser();
  }, []);

  if (loading || loadingBLock) return <p>Get Room Data...</p>;

  const gotoNewMessage = () => {
    navigate("/message/new");
  };

  return (
    <div className="white-bg center-col">
      <Navbar />
      {modalNew && (
        <MessageNew
          roomData={data.rooms}
          userBlockData={dataBlock.blocks}
          closeModal={setModalNew}
        ></MessageNew>
      )}
      <div className="message-container">
        <div className="message-main">
          <div className="col-user">
            <div className="head-user">
              <span className="span-user cursor-pointer" onClick={() => navigate("/message")}>Message</span>
              <BiMessageAdd
                className="button-new-message cursor-pointer"
                size={20}
                onClick={() => setModalNew(true)}
              />
            </div>
            <MessageList roomData={data.rooms} />
          </div>
          <div className="col-chat">
            <Routes>
              <Route
                path="/:roomId"
                element={<MessageRoom userBlockData={dataBlock.blocks} />}
              ></Route>
            </Routes>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MessagePage;
