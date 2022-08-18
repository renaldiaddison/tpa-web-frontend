import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Register } from "../queries/userQueries";

const RegisterPage = () => {
  const [registerAccount] = useMutation(Register);
  const [Error, setError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: any) => {
    e.preventDefault();
    registerAccount({
      variables: {
        email: (document.getElementById("email") as HTMLInputElement).value,
        firstName: (document.getElementById("firstName") as HTMLInputElement)
          .value,
        lastName: (document.getElementById("lastName") as HTMLInputElement)
          .value,
        password: (document.getElementById("password") as HTMLInputElement)
          .value,
      },
    })
      .then(() => {
        setError(false);
        navigate("/");
      })
      .catch((err) => {
        setError(true);
      });
  };

  return (
    <div className="h-screen">
      <div className="h-full flex justify-center items-center">
        <div className="w-full max-w-sm border-2 items-center shadow-md rounded-lg">
          <p className="py-6 px-8 text-center text-2xl font-bold border-b-2 justify-between items-center">
            Register
          </p>
          <form
            onSubmit={handleRegister}
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
              <label className="block text-gray-700 text-sm font-bold mb-2">
                First Name
              </label>
              <input
                className="shadow appearance-none border box-border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus-outline-none"
                name="firstName"
                id="firstName"
                type="text"
                placeholder="First Name"
              ></input>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Last Name
              </label>
              <input
                className="shadow appearance-none border box-border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus-outline-none"
                name="lastName"
                id="lastName"
                type="text"
                placeholder="Last Name"
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
            <div className="items-center justify-between pt-2">
              <button
                className="w-full bg-blue-500 button-style text-white font-bold py-2 px-4 rounded-lg focus-outline-none outline-none"
                type="submit"
              >
                Register
              </button>
              <div className="flex text-sm justify-center pt-3">
                <p className="mr-1">Not a member?</p>
                <p className="align-baseline font-bold text-blue-500">
                  <Link to="/">Login here</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
