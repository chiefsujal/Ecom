import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (storedToken && storedToken !== "undefined" && storedToken !== "null") {
        setToken(storedToken);
      }
      
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
          } else {
            throw new Error("Invalid user data");
          }
        } catch (parseError) {
          console.warn("Invalid user data in localStorage, clearing it:", parseError);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.error("Error loading auth data from localStorage:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  const storeTokenInLS = ({ token, user }) => {
    if (!token) {
      console.error("No token provided");
      toast.error("Authentication failed");
      return;
    }

    if (!user || !user.id) {
      console.error("Invalid user data");
      toast.error("Authentication failed");
      return;
    }

    try {
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error storing auth data:", error);
      toast.error("Failed to store authentication data");
    }
  };


  const LogoutUser = () => {
    try {
      setToken("");
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout");
    }
  };

  const isLoggedIn = !!token && !!user && !!user.id;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        user,
        storeTokenInLS,
        LogoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};