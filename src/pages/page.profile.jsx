import "../css/page.profile.css";
import imgProfile from "../assets/img/picture.png";
import IconLink from "../components/icons/icon.link";
import IconAdmin from "../components/icons/icon.admin";
import IconChevronRight from "../components/icons/icon.chevron.right";
import IconCoin from "../components/icons/icon.coin";
import NavBar from '../components/navbar';
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState, useEffect } from "react";
import { getUserById } from "../servises/api.service";
import { splitByFirstPipe } from "../utils/utils";

// Компонент карточки предмета
const ItemCard = ({ item, onClick }) => {
  const { image_url, name, price_coin, rarity } = item.skin || {};
  const [title, subtitle] = splitByFirstPipe(name || "");

  return (
    <button className="item" onClick={onClick} style={{ background: `radial-gradient(120% 100%,${rarity}80, var(--cs-bg)`}}>
      <div className="content">
        <div className="img">
          <img className="item_img" src={image_url} alt="item" />
        </div>
        <div className="gr">
          <p className="item_title">{title}</p>
          <span className="item_subtitle">{subtitle}</span>
        </div>
        <div className="price">
          <IconCoin />
          <span className="value">{price_coin}</span>
        </div>
      </div>
    </button>
  );
};

// Блок секции с заголовком и гридом предметов
const SectionBlock = ({ title, items, navigate }) => {
  if (!items?.length) return null;
  return (
    <>
      <p className="title">{title}</p>
      <div className="items_grid">
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => navigate(`/item/${item.id}`)}
          />
        ))}
      </div>
    </>
  );
};

const PageProfile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const userId = user?.id || 6032665836;

  useEffect(() => {
    getUserById(userId)
      .then(setUserData)
      .catch(console.error);
  }, [userId]);

  const items = userData?.inventory || [];

  const getItemsByStatus = (status) => items.filter(item => item.status === status);
const top3Items = [...items]
  .sort((a, b) => (b.skin?.price_usd || 0) - (a.skin?.price_usd || 0))
  .slice(0, 3);

  console.log(userData);
  
  return (
    <section className="page_profile">
      {/* Профиль пользователя */}
      <div className="header">
        <img className="user_img" src={user?.avatar || imgProfile} alt="User avatar" />
        <p className="user_name">{user?.name || "User Name"}</p>
        <div className="user_menu">
          <button className="btn" onClick={() => navigate("/withdraw")}>
            <div className="c">
              <IconLink />
              <span>Трейд Ссылка</span>
            </div>
            <IconChevronRight />
          </button>
          <a className="btn" href="https://t.me/Mahmud_932">
            <div className="c">
              <IconAdmin />
              <span>Поддержка</span>
            </div>
            <IconChevronRight />
          </a>
        </div>
      </div>

      {/* Инвентарь */}
      <div className="user_items">
        <SectionBlock title="ТОП 3" items={top3Items} navigate={navigate} />
        <SectionBlock title="В НАЛИЧИИ" items={getItemsByStatus(0)} navigate={navigate} />
        <SectionBlock title="ПРОДАНО" items={getItemsByStatus(1)} navigate={navigate} />
        <SectionBlock title="ВЫВЕДЕНО" items={getItemsByStatus(2)} navigate={navigate} />
      </div>

      <NavBar />
    </section>
  );
};

export default PageProfile;
