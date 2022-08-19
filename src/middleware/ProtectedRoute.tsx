import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/LocalStorage";
import { useUserContext } from "../lib/UserContext";

export default function ProtectedRoute({ children }: any) {
  const [user, setUser] = useLocalStorage("user", {})
  // const userContext = useContext(useUserContext);
  // const user = userContext.user;

  if (Object.keys(user).length === 0) {
    return <Navigate to="/" />;
  }

  return children;
}
