import { useMutation } from "@apollo/client";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../queries/userQueries";
import "../styles/css-library.scss";

const LoginPage = () => {
  const [loginUser] = useMutation(Login);
  const handleLogin = (e: any) => {
    e.preventDefault();
    loginUser({
      variables: {
        email: (document.getElementById("email") as HTMLInputElement).value,
        password: (document.getElementById("password") as HTMLInputElement)
          .value,
      },
    })
      .then(() => {
        console.log("Logged In");
      })
      .catch((err) => {
        console.log("err" + err);
      });
  };

  function showPass() {
    var x = document.getElementById("password") as HTMLInputElement;
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  return (
    <div className="h-screen">
      <div className="h-full flex justify-center items-center">
        <div className="w-full max-w-sm border-2 items-center shadow-md rounded-lg">
          <p className="py-6 px-8 text-center text-2xl font-bold border-b-2 justify-between items-center">
            Login
          </p>
          <form
            onSubmit={handleLogin}
            className="bg-white rounded-lg px-8 pt-6 pb-6 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border box-border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus-outline-none"
                name="email"
                id="email"
                type="email"
                placeholder="Email"
              ></input>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border box-border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus-outline-none"
                name="password"
                id="password"
                type="password"
                placeholder="Password"
              ></input>
            </div>
            <div className="flex mb-4">
              <input
                className="form-check-input h-4 w-4 border  border-gray-300 rounded-lg-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus-outline-none mt-1 mr-2"
                type="checkbox"
                onClick={showPass}
                id="flexCheckDefault"
                name="flexCheckDefault"
              ></input>
              <label
                className="form-check-label inline-block text-gray-800"
                htmlFor="flexCheckDefault"
              >
                Show Password
              </label>
            </div>
            <div className="items-center justify-between">
              <button
                className="w-full bg-blue-500 button-style text-white font-bold py-2 px-4 rounded-lg focus-outline-none outline-none"
                type="submit"
              >
                Login
              </button>
              <div className="flex text-sm justify-center pt-3">
                <p className="mr-1">Not a member?</p>
                <p className="align-baseline font-bold text-blue-500">
                  <Link to="/register">Register here</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
