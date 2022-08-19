import React from "react";
import { AiFillHome, AiFillMessage } from "react-icons/ai";
import { BsPeopleFill, BsLinkedin, BsPersonCircle } from "react-icons/bs";
import { FaSuitcase } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { IoMdNotifications } from "react-icons/io";
import { useLocalStorage } from "../hooks/LocalStorage";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useLocalStorage("user", {});
  const navigate = useNavigate()

  const handleLogOut = (e: any) => {
    e.preventDefault();
    if(Object.keys(user).length !== 0) {
        setUser({})
    }

    navigate("/")
  };

  return (
    <div className="white-bg w-screen navbar">
      <BsLinkedin className="navbar-logo"></BsLinkedin>
      <input type="text" className="searchbar white-bg" placeholder="Search" />
      <div className="navbar-menu-container">
        <div className="navbar-items">
          <AiFillHome className="navbar-icon"></AiFillHome>
          <h6 className="item-label">Home</h6>
        </div>
        <div className="navbar-items">
          <BsPeopleFill className="navbar-icon"></BsPeopleFill>
          <h6 className="item-label">My Network</h6>
        </div>
        <div className="navbar-items">
          <FaSuitcase className="navbar-icon"></FaSuitcase>
          <h6 className="item-label">My Network</h6>
        </div>
        <div className="navbar-items">
          <AiFillMessage className="navbar-icon"></AiFillMessage>
          <h6 className="item-label">Messaging</h6>
        </div>
        <div className="navbar-items">
          <IoMdNotifications className="navbar-icon"></IoMdNotifications>
          <h6 className="item-label">Notifications</h6>
        </div>
        <div className="navbar-items">
          <BsPersonCircle className="navbar-icon"></BsPersonCircle>
          <h6 className="item-label">{"Hello, " + user.name}</h6>
        </div>
        <div className="navbar-items" onClick={handleLogOut}>
          <BiLogOut className="navbar-icon"></BiLogOut>
          <h6 className="item-label">LogOut</h6>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
