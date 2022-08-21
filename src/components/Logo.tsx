import React from "react";

const Logo = () => {
  function handleLogoClick() {
    window.location.reload();
  }

  return (
    <img
      src="src\assets\Logo.png"
      onClick={handleLogoClick}
      className="fixed pt-10 pl-10 cursor-pointer"
      width="130"
      height="30"
    ></img>
  );
};

export default Logo;
