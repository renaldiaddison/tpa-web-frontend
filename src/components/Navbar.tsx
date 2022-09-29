import React from "react";
import { AiFillHome, AiFillMessage } from "react-icons/ai";
import { BsPeopleFill, BsLinkedin, BsPersonCircle } from "react-icons/bs";
import { FaSuitcase } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { IoMdNotifications } from "react-icons/io";
import { useLocalStorage } from "../hooks/LocalStorage";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext, useUserContext } from "../lib/UserContext";
import { toastError } from "../script/Toast";

const Navbar = () => {
  const UserContext = useUserContext();
  const [token, setToken] = useLocalStorage("token", "");
  const [userId, setUserId] = useLocalStorage("userId", "");
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const handleLogOut = (e: any) => {
    e.preventDefault();
    if (Object.keys(token).length !== 0) {
      setUserId("");
      setToken("");
    }

    navigate("/");
  };

  const handleActivePage = (state: any) => {
    if (state.isActive) {
      return "navbar-items-active";
    } else {
      return "navbar-items";
    }
  };

  const home = () => {
    navigate("/home");
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      if (searchText === "") {
        toastError("Search text cannot be empty");
      } else {
        navigate("/search/" + searchText);
      }
    }
  };

  const handleChangeSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="white-bg w-screen navbar">
      <BsLinkedin
        className="navbar-logo cursor-pointer"
        onClick={home}
      ></BsLinkedin>
      <input
        onChange={handleChangeSearch}
        onKeyDown={handleKeyDown}
        type="text"
        className="searchbar white-bg"
        placeholder="Search"
      />
      <div className="navbar-menu-container mb-5">
        <NavLink to="/home" className={handleActivePage}>
          <AiFillHome className="navbar-icon"></AiFillHome>
          <h6 className="item-label">Home</h6>
        </NavLink>
        <NavLink to="/my-network" className={handleActivePage}>
          <BsPeopleFill className="navbar-icon"></BsPeopleFill>
          <h6 className="item-label">My Network</h6>
        </NavLink>
        <NavLink to="/job" className={handleActivePage}>
          <FaSuitcase className="navbar-icon"></FaSuitcase>
          <h6 className="item-label">Jobs</h6>
        </NavLink>
        <NavLink to="/message" className={handleActivePage}>
          <AiFillMessage className="navbar-icon"></AiFillMessage>
          <h6 className="item-label">Messaging</h6>
        </NavLink>
        <NavLink to="/notification" className={handleActivePage}>
          <IoMdNotifications className="navbar-icon"></IoMdNotifications>
          <h6 className="item-label">Notifications</h6>
        </NavLink>
        <NavLink
          to={"/profile/" + UserContext.user.id}
          className={handleActivePage}
        >
          <img
            src={UserContext.user.profile_picture}
            className="navbar-icon profile-img cover"
          ></img>
          <h6 className="item-label">
            {"Hello, " + UserContext.user.firstName}
          </h6>
        </NavLink>
        <div className="navbar-items cursor-pointer" onClick={handleLogOut}>
          <BiLogOut className="navbar-icon"></BiLogOut>
          <h6 className="item-label">Log Out</h6>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
