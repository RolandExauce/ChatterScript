import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, signedUp, setSignedUp }}
    >
      {children}
    </AuthContext.Provider>
  );
};
