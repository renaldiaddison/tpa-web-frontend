import { useMutation } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { CreateAndSendResetLink } from "../queries/forgotPasswordLinkQueries";
import { toastError, toastSuccess } from "../script/Toast";

const ForgotPasswordPage = () => {
  const [resetPassword] = useMutation(CreateAndSendResetLink);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    resetPassword({
      variables: {
        email: (document.getElementById("email") as HTMLInputElement).value,
      },
    })
      .then(() => {
        toastSuccess("Success: Reset password link sent, please check your email!")
      })
      .catch((err) => {
        toastError(String(err));
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
      <Logo />
      <div className="h-full flex justify-center items-center">
        <div className="w-full max-w-sm border-2 items-center shadow-md rounded-lg">
          <div className="pb-1 border-b-2">
            <p className="px-8 text-2xl font-bold justify-between items-center">
              Forgot Password
            </p>
            <p className="px-8 text-sm justify-between items-center mt-minus-1">
              Reset password in two quick steps
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg px-8 pt-6 mb-4"
          >
            <div className="mb-6">
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
            <div className="items-center justify-between">
              <button
                className="w-full cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold py-2 px-4 rounded-lg"
                type="submit"
              >
                Reset Password
              </button>
              <div className="flex text-sm justify-center pb-4 pt-5">
                <Link to="/">Back</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
