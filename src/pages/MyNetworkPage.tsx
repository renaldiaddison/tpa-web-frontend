import { useQuery } from "@apollo/client";
import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import UserConnectionCard from "../components/UserConnectionCard";
import UserConnectRequestCard from "../components/UserConnectRequestCard";
import UserSuggestionCard from "../components/UserSuggestionCard";
import UserSuggestionProfile from "../components/UserSuggestionProfile";
import { useUserContext } from "../lib/UserContext";
import { UserSuggestion } from "../queries/UserQueries";
import "../styles/css-library.scss";
import "../styles/my-network.scss";

const MyNetworkPage = () => {
  const UserContext = useUserContext();

  const {
    loading: loadingUserSuggestion,
    error: errorUserSuggestion,
    data: dataUserSuggestion,
    refetch: refetchUserSuggestion,
  } = useQuery(UserSuggestion, {
    variables: { userId: UserContext.user.id },
  });

  return (
    <div className="white-bg center-col">
      <Navbar></Navbar>
      <div className="">
        <div className="sec-profile white-bg">
          <div className="flex-r w-full justify-between">
            <p className="text-black text-l bold m-profile">Connect Requests</p>
          </div>
          {UserContext.user.ConnectRequest.length === 0 && (
            <>
              <p className="text-black text-s w-full m-desc">-</p>
              <div className="m-20px"></div>
            </>
          )}
          {UserContext.user.ConnectRequest.map((connectReq: any) => {
            return (
              <UserConnectRequestCard
                key={connectReq.id}
                userFrom={connectReq.fromUser}
              />
            );
          })}
        </div>
        <div className="sec-profile white-bg">
          <div className="flex-r w-full justify-between">
            <p className="text-black text-l bold m-profile">Connections</p>
          </div>
          {UserContext.user.Connection.length === 0 && (
            <>
              <p className="text-black text-s w-full m-desc">-</p>
              <div className="m-20px"></div>
            </>
          )}
          {UserContext.user.Connection.map((connection: any) => {
            return (
              <UserConnectionCard key={connection.id} connection={connection} />
            );
          })}
        </div>
        <div className="sec-profile white-bg">
          <div className="flex-r w-full justify-between">
            <p className="text-black text-l bold m-profile">
              User you might know
            </p>
          </div>
          {loadingUserSuggestion ? (
            <p className="text-black text-s w-full m-desc">Loading...</p>
          ) : !errorUserSuggestion ? (
            <>
              <UserSuggestionProfile
                userSuggestionData={dataUserSuggestion.UserSuggestion}
                refetchUserSuggestion={refetchUserSuggestion}
              />
            </>
          ) : (
            <>
              <p className="text-black text-s w-full m-desc">-</p>
              <div className="m-20px"></div>
            </>
          )}
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default MyNetworkPage;
