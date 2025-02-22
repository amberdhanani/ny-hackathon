import { User } from "firebase/auth";
import { createContext, useContext } from "react";


type AuthContextType = {
  currentAuthUser: User | null;
  logout: () => void;
  signInWithGoogle: () => void;
  loading: boolean;
};

const defaultValue: AuthContextType = {
  currentAuthUser: null,
  logout: () => {},
  signInWithGoogle: async () => {
    return await { user: null, error: null };
  },loading: false,
};
export const AuthContext = createContext<AuthContextType>(defaultValue);

export const useAuth = () => {
  return useContext(AuthContext);
};
