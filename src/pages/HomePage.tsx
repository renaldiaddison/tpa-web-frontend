import { useContext } from "react";
import Navbar from "../components/Navbar";
import { useLocalStorage } from "../hooks/LocalStorage";

const HomePage = () => {
  const [user, setUser] = useLocalStorage("user", {})

  console.log(user)
  return <Navbar></Navbar>;
};

export default HomePage;
