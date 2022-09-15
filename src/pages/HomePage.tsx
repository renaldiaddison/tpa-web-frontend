import { useQuery } from "@apollo/client";
import { useContext } from "react";
import Navbar from "../components/Navbar";
import { useLocalStorage } from "../hooks/LocalStorage";
import { RefetchContext } from "../lib/RefetchContext";
import { UserContext } from "../lib/UserContext";
import { GetUserById } from "../queries/UserQueries";

const HomePage = () => {
  const { user, setUser, token, setToken } = useContext(UserContext);

  return <Navbar></Navbar>;
};

export default HomePage;
