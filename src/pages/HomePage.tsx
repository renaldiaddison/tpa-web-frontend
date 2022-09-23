import { useQuery } from "@apollo/client";
import { useContext } from "react";
import Navbar from "../components/Navbar";
import { useLocalStorage } from "../hooks/LocalStorage";
import { UserContext, useUserContext } from "../lib/UserContext";
import { GetUserById } from "../queries/UserQueries";
import { toastSuccess } from "../script/Toast";

const HomePage = () => {
  const UserContext = useUserContext();

  console.log(UserContext.user);


  return (
    <div>
      <Navbar></Navbar>
    </div>
  );
};

export default HomePage;
