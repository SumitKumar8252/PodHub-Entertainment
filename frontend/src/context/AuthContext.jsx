import { useEffect, useMemo, useState } from "react";
import AuthContext from "./authContextBase";
import api from "../utils/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("podhub_user");
    return raw ? JSON.parse(raw) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("podhub_token") || ""
  );

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (user) localStorage.setItem("podhub_user", JSON.stringify(user));
    else localStorage.removeItem("podhub_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("podhub_token", token);
    else localStorage.removeItem("podhub_token");
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      login,
      logout,
      register,
    }),
    [user, token, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
