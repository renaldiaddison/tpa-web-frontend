import { createContext, useState } from "react";

export const useUserContext = createContext(null as any);

export default function UserContext({children} : any) {
  const [user, setUser] = useState(Object);
  const data = {user, setUser}

  return (
    <useUserContext.Provider value={data}>
      {children}
    </useUserContext.Provider>
  );
}
