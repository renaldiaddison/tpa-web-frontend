import { createContext, useState } from "react";
import { useLocalStorage } from '../hooks/LocalStorage';

export const UserContext = createContext(null as any);

export default function AuthContext({children} : any) {
  const [user, setUser] = useLocalStorage("user", {})

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
}
