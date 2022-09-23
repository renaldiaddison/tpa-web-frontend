import { useQuery } from "@apollo/client";
import { createContext, useContext, useState } from "react";
import { useLocalStorage } from '../hooks/LocalStorage';
import { GetUserById } from "../queries/UserQueries";

export const UserContext = createContext(null as any);

export default function AuthContext({children} : any) {
  const [userId, setUserId] = useLocalStorage("userId", "")
  const [token, setToken] = useLocalStorage("token", "")

  const userDB = useQuery(GetUserById, {
    variables: {
      id: userId,
    },
  });

  if (userDB.loading) return <p>Loading...</p>
  if (userDB.error) console.log(userDB.error)

  return (
    <UserContext.Provider value={{user : userDB.data.getUserById, token, refetchUser: userDB.refetch}}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext)