import React, { useState } from "react";

const Filter = ({ setFilter }: any) => {
  const buttonStyle =
    "cursor-pointer bg-white border-white button-gray-style font-bold rounded-lg text-black px-5 py-1";
  const buttonStyleActive =
    "cursor-pointer bg-white border-black button-gray-style font-bold rounded-lg text-black px-5 py-1";

  const [buttonUser, setButtonUser] = useState(buttonStyle);
  const [buttonPost, setButtonPost] = useState(buttonStyle);
  const [buttonFilter, setButtonFilter] = useState(buttonStyleActive);

  const changeFilterUser = () => {
    setFilter("User");
    setButtonUser(buttonStyleActive);
    setButtonPost(buttonStyle);
    setButtonFilter(buttonStyle);
  };

  const changeFilterPost = () => {
    setFilter("Post");
    setButtonUser(buttonStyle);
    setButtonPost(buttonStyleActive);
    setButtonFilter(buttonStyle);
  };

  const resetFilter = () => {
    setFilter("");
    setButtonUser(buttonStyle);
    setButtonPost(buttonStyle);
    setButtonFilter(buttonStyleActive);
  };

  return (
    <div className="filter-container">
      <div className="button-container">
        <button className={`${buttonFilter} button-margin`} onClick={resetFilter}>
          All
        </button>
        <button className={`${buttonUser} button-margin`} onClick={changeFilterUser}>
          Users
        </button>
        <button className={`${buttonPost} button-margin`} onClick={changeFilterPost}>
          Posts
        </button>
      </div>
    </div>
  );
};

export default Filter;
