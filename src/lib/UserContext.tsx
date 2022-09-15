import { createContext, useContext } from "react";
import { useLocalStorage } from '../hooks/LocalStorage';

export const UserContext = createContext(null as any);

export default function AuthContext({children} : any) {
  const [user, setUser] = useLocalStorage("user", {})
  const [token, setToken] = useLocalStorage("token", {})

  return (
    <UserContext.Provider value={{user, setUser, token, setToken}}>
      {children}
    </UserContext.Provider>
  );
}