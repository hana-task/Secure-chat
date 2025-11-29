import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthUser {
  username: string;
  userId: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const logoutChannel = new BroadcastChannel("auth");


const STORAGE_KEY = "securechat_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    logoutChannel.onmessage = (ev) => {
      if (ev.data === "logout") {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      }
    };
  }, []);
  

  const login = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    logoutChannel.postMessage("logout");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
