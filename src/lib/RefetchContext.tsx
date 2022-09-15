import { useQuery } from "@apollo/client";
import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/LocalStorage";
import { GetUserById } from "../queries/UserQueries";
import { UserContext } from "./UserContext";

export const RefetchContext = createContext(null as any);

export default function Refetch({ children }: any) {
  const { user, setUser } = useContext(UserContext);
  const userDB = useQuery(GetUserById, {
    variables: {
      id: user?.id,
    },
  });

  const refetchUser = () => {
    userDB.refetch().then((x) => {
      setUser(x.data.getUserById);
    });
  };

  return (
    <RefetchContext.Provider value={{ refetchUser }}>
      {children}
    </RefetchContext.Provider>
  );
}
