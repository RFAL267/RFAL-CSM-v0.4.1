// context/UserDataContext.jsx
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);       // Telegram user (basic)
  const [userData, setUserData] = useState(null); // Full user profile from API

  // опционально: методы изменения userData
  const updateBalance = (amount) => {
    setUserData((prev) => ({
      ...prev,
      balance: (prev?.balance || 0) + amount,
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, userData, setUserData, updateBalance }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserContext);
}
