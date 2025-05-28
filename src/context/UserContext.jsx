import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) return;

    tg.ready();

    if (tg.initDataUnsafe?.user) {
      const telegramUser = tg.initDataUnsafe.user;

      const userData = {
        id: telegramUser.id,
        username: telegramUser.username,
        name: `${telegramUser.first_name ?? ''} ${telegramUser.last_name ?? ''}`.trim(),
        avatar: telegramUser.photo_url,
        isTelegram: true,
      };

      setUser(userData);
    } else {
      setUser({ isTelegram: false });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
