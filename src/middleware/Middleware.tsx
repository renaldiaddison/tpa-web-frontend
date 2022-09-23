import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/LocalStorage";

export default function ProtectedRoute({ children }: any) {
  const [token, setToken] = useLocalStorage("token", "");

  if (token === "") {
    return <Navigate to="/" />;
  }

  return children;
}

export function UnprotectedRoute({ children }: any) {
  const [token, setToken] = useLocalStorage("token", "");

  if (token !== "") {
    return <Navigate to="/home" />;
  }

  return children;
}
