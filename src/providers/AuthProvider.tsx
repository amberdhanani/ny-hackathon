import React, { useState, useEffect, useCallback, JSX } from "react";
import { User, signInWithPopup } from "firebase/auth";
import { auth, provider as googleAuthProvider } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";

type Props = {
  children: JSX.Element;
};

const AuthProvider = ({ children }: Props) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [currentAuthUser, setCurrentAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { user } = await signInWithPopup(auth, googleAuthProvider);
      if (user) {
        console.log("user was found");
      } else {
        console.log("user was not found");
      }
    } catch (error: any) {}
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (!user) {
        setCurrentAuthUser(null);
        return;
      }
      setCurrentAuthUser(user);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    setCurrentAuthUser(null);
    return auth.signOut();
  }

  useEffect(() => {
    if (currentAuthUser) {
      setAuthLoading(false);
    }
  }, [currentAuthUser, setAuthLoading]);

  const value = {
    currentAuthUser,
    signInWithGoogle,
    logout, 
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

