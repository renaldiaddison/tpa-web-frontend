import { Toaster } from "react-hot-toast";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Refetch, { RefetchContext } from "./lib/RefetchContext";
import ProtectedRoute, { UnprotectedRoute } from "./middleware/Middleware";
import AccountVerificationPage from "./pages/AccountVerificationPage";
import ErrorPage from "./pages/ErrorPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { useEffect, useState, useContext } from "react";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { UserContext } from "./lib/UserContext";

const Protected = () => {
  return (
    <ProtectedRoute>
      <Refetch>
        <Outlet />
      </Refetch>
    </ProtectedRoute>
  );
};

const Unprotected = () => {
  return (
    <UnprotectedRoute>
      <Outlet />
    </UnprotectedRoute>
  );
};

function App() {
  const main_url = "http://localhost:8080";
  const url = main_url + "/query";
  const { user, setUser, token, setToken } = useContext(UserContext);
  const authLink = new ApolloLink((operation: any, forward: any) => {
    if (user && token !== undefined && Object.keys(token).length !== 0) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return forward(operation);
  });

  const httplink = createHttpLink({
    uri: url,
  });

  const client = new ApolloClient({
    link: authLink.concat(httplink),
    cache: new InMemoryCache({}),
  });

  return (
    <ApolloProvider client={client}>
      <Toaster position="bottom-left" />
      <Routes>
        <Route element={<Unprotected />}>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route
            path="/activate-account/:id"
            element={<AccountVerificationPage />}
          ></Route>
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          ></Route>
          <Route
            path="/reset-password/:id"
            element={<ResetPasswordPage />}
          ></Route>
        </Route>
        <Route element={<Protected />}>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/profile/:id" element={<ProfilePage />}></Route>
        </Route>
        {/* <Route path="/PageNotFound" element={<ErrorPage errorCode ="404" errorDefinition = "Page Not Found"></ErrorPage>}></Route>
        <Route path="*" element={<Navigate to="/PageNotFound"></Navigate>}></Route> */}
        <Route
          path="*"
          element={
            <ErrorPage
              errorCode="404"
              errorDefinition="Page Not Found"
            ></ErrorPage>
          }
        ></Route>
      </Routes>
    </ApolloProvider>
  );
}

export default App;
