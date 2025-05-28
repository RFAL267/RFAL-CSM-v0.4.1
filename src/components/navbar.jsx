import "../css/navbar.css";
// icons
import IconWallet from "./icons/icon.wallet";
import IconStore from "./icons/icon.store";
import IconProfile from "./icons/icon.profile";
import IconStar from "./icons/icon.star"
// react-router
import { useNavigate, useLocation } from "react-router-dom";
// context
import { useUser } from "../context/UserContext";
import { useUserData } from "../context/UserDataContext";
// api
import { getUserById } from "../servises/api.service";
// react-query
import { useQuery } from "@tanstack/react-query";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const user_id = user?.id || 6032665836;

  // Запрос данных пользователя с кэшем
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData", user_id],
    queryFn: () => getUserById(user_id),
    staleTime: 1 * 60 * 1000, // 1 минут данные считаются "свежими"
  });

  const navItems = [
    { path: "/", label: `${userData?.balance || 0}`, icon: <IconWallet /> },
    { path: "/cases", label: "Кейсы", icon: <IconStore /> },
    { path: "/rating", label: "Рейтинг", icon: <IconStar /> },
    { path: "/profile", label: "Профиль", icon: <IconProfile /> },
  ];

  return (
    <div className="main_navbar">
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`nav_btn ${location.pathname === item.path ? "active_nav" : ""}`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default NavBar;
