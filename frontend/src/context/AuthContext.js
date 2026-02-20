import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 Important

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const isExpired = payload.exp * 1000 < Date.now();

        if (!isExpired) {
          setUser({
            role: payload.role?.toUpperCase(),
            name: payload.name,
            token: token,
          });
        } else {
          localStorage.clear();
        }
      } catch (error) {
        localStorage.clear();
      }
    }

    setLoading(false); // 🔥 Important
  }, []);

  const login = (token) => {
    localStorage.setItem("access_token", token);

    const payload = JSON.parse(atob(token.split(".")[1]));

    setUser({
      role: payload.role?.toUpperCase(),
      name: payload.name,
      token: token,
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
