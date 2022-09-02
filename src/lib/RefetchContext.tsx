import { useQuery } from "@apollo/client";
import { createContext, useState } from "react";
import { useLocalStorage } from '../hooks/LocalStorage';

export const RefetchContext = createContext(null as any);

export default function Refetch({children} : any) {
  // const [user, setUser] = useQuery()

  return (
    <RefetchContext.Provider value={{}}>
      {children}
    </RefetchContext.Provider>
  );
}
