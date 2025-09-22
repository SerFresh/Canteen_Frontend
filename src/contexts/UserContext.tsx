import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  name: string;
  nickname: string;
  email: string;
  imageProfile?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("https://canteen-backend-igyy.onrender.com/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
