import React, { useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut as logOut } from "firebase/auth";
import { auth } from "./config";

const AuthContext = React.createContext({
  authUser: null,
  isLoading: true,
});

const FirebaseAuth = () => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clear = () => {
    setAuthUser(null);
    setIsLoading(false);
  };

  const authStateChanged = async (user) => {
    setIsLoading(true);
    if (!user) {
      clear();
      return;
    }

    setAuthUser({
      uid: user.uid,
      email: user.email,
      username: user.displayName,
    });
    setIsLoading(false);
  };

  const signOut = () => {
    logOut(auth).then(() => clear());
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unSubscribe();
  }, []);

  return {
    authUser,
    isLoading,
    setAuthUser,
    signOut,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = FirebaseAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default FirebaseAuth;

export const useAuth = () => useContext(AuthContext);
