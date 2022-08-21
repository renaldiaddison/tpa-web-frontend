import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/css-library.scss";

const ErrorPage = ({ errorCode, errorDefinition }: any) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen">
      <div className="h-full flex justify-center items-center">
        <div>
          <p>{errorCode} | {errorDefinition}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold py-2 px-4 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
