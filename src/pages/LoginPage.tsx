import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/LocalStorage";
import { Login } from "../queries/userQueries";
import "../styles/css-library.scss";
import Logo from "../components/Logo";
import { toastError, toastSuccess } from "../script/Toast";
import { useContext } from 'react';
import { UserContext } from '../lib/UserContext';

const LoginPage = () => {
  const [loginUser] = useMutation(Login);
  const navigate = useNavigate();
  const {user, setUser} = useContext(UserContext);

  const handleLogin = (e: any) => {
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email === "") {
      toastError("Error: Email cannot be empty");
    } else if (!email.match(mailFormat)) {
      toastError("Error: Please enter a valid email");
    } else if (password === "") {
      toastError("Error: Password cannot be empty");
    } else {
      loginUser({
        variables: {
          email: email,
          password: password,
        },
      })
        .then((x) => {
          const loginData = x.data.login;
          setUser(loginData);
          toastSuccess("Success: Logged in as " + loginData.name)
          navigate("/home");
        })
        .catch((err) => {
          toastError(String(err));
        });
    }
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
              Login
            </p>
            <p className="px-8 text-sm justify-between items-center mt-minus-1">
              Stay updated on your professional world
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white rounded-lg px-8 pt-6 mb-4"
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
                className="h-4 w-4 border border-gray-300 rounded-lg-sm bg-white checked:bg-blue-600 checked:border-blue-600 mr-2"
                type="checkbox"
                onClick={showPass}
                id="flexCheckDefault"
                name="flexCheckDefault"
              ></input>
              <label
                className="form-check-label inline-block text-gray-800 mt-0"
                htmlFor="flexCheckDefault"
              >
                Show Password
              </label>
            </div>

            <div className="items-center justify-between">
              <button
                className="w-full cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold py-2 px-4 rounded-lg"
                type="submit"
              >
                Login
              </button>
              <div className="flex text-sm justify-center pt-3">
                <p className="mr-1">New to LinkedIn?</p>
                <p className="align-baseline">
                  <Link to="/register">Join now</Link>
                </p>
              </div>
              <div className="flex text-sm justify-center pb-4">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
