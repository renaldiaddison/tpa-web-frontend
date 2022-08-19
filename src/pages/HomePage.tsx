import { useContext } from "react";
import Navbar from "../components/Navbar";
import { useLocalStorage } from "../hooks/LocalStorage";
import UserContext, { useUserContext } from "../lib/UserContext";

const HomePage = () => {
  const userContext = useContext(useUserContext);
  const [user, setUser] = useLocalStorage("user", {})

  console.log(user)
  return <Navbar></Navbar>;
};

export default HomePage;
