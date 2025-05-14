import { createContext, use, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./actions/user";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth());
  }, []);

  const loginProvider = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, loginProvider, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
