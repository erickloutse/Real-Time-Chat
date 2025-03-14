import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/api";

interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    username?: string;
    avatarUrl?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/auth/profile");
          setUser(response.data);
        } catch (err) {
          localStorage.removeItem("token");
          setError("Session expired. Please login again.");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      setError(null);
      const response = await api.post("/auth/register", {
        email,
        password,
        username,
      });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateProfile = async (data: {
    username?: string;
    avatarUrl?: string;
  }) => {
    try {
      setError(null);
      const response = await api.put("/auth/profile", data);
      setUser(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Profile update failed");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
