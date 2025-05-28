import "../css/page.item.css";

// Иконки
import IconCoin from "../components/icons/icon.coin";
import IconSteam from "../components/icons/icon.steam";
import IconShare from "../components/icons/icon.share";

// React и роутинг
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";

// Контекст и сервисы
import { useUser } from "../context/UserContext";
import { getUserById, postSellItem } from "../servises/api.service";

// Хук Telegram
import { useTelegramBackButton } from "../hooks/useTelegramBackButton";

// Утилиты
import { splitByFirstPipe } from "../utils/utils";

// Получение редкости по HEX-коду
const getRarityByHex = (hex) => {
  const rarityColors = {
    "#B0C3D9": "Consumer Grade",
    "#5E98D9": "Industrial Grade",
    "#4B69FF": "Mil-Spec",
    "#8847FF": "Restricted",
    "#D32CE6": "Classified",
    "#EB4B4B": "Covert",
    "#FFD700": "Contraband",
    "#E4AE33": "Extraordinary",
  };
  return rarityColors[hex?.trim().toUpperCase()] || "Unknown";
};

// Маппинг статусов
const statusMap = {
  0: { label: "В наличии", color: "#4CAF50" },
  1: { label: "Продано", color: "#FF5722" },
  2: { label: "Выведено", color: "#2196F3" },
};

const PageItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id || 6032665836;

  const [itemData, setItemData] = useState(null);

  useTelegramBackButton(() => navigate(-1));

  useEffect(() => {
    const fetchUserItem = async () => {
      try {
        const userData = await getUserById(userId);
        const foundItem = userData?.inventory?.find(
          (invItem) => invItem.id === parseInt(id)
        );

        if (foundItem) {
          setItemData({
            ...foundItem.skin,
            status: foundItem.status,
          });
        } else {
          console.warn("Item not found in inventory.");
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    };
    fetchUserItem();
  }, [id, userId]);

  const handleSell = useCallback(async () => {
    if (!itemData || itemData.status !== 0) return;
    if (!window.confirm("Вы действительно хотите продать этот скин?")) return;

    try {
      await postSellItem(id);
      alert("Скин успешно продан!");
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка при продаже:", error);
      alert("Ошибка при продаже скина.");
    }
  }, [id, itemData, navigate]);

  const handleWithdraw = () => {
    if (itemData?.status !== 0) return;
    navigate(`/withdraw/${id}`);
  };

  const statusInfo = useMemo(() => statusMap[itemData?.status] || { label: "Неизвестно", color: "#999" }, [itemData]);

  if (!itemData) return null;

  return (
    <section className="page_item">
      <div className="header" style={{ background: `radial-gradient(100% 100%,${itemData.rarity}90, transparent `}}>

        <div className="item">
          <img src={itemData.image_url} alt="Skin" />
          <div className="title">
            <p>{splitByFirstPipe(itemData.name)[0]}</p>
            <span>{splitByFirstPipe(itemData.name)[1]}</span>
          </div>
        </div>

        <div className="options">
          <button
            onClick={handleSell}
            disabled={itemData.status !== 0}
            className={itemData.status !== 0 ? "disabled" : ""}
          >
            <IconCoin />
            Продать
          </button>
          <button
            onClick={handleWithdraw}
            disabled={itemData.status !== 0}
            className={itemData.status !== 0 ? "disabled" : ""}
          >
            <IconSteam />
            Вывести
          </button>
          <button>
            <IconShare />
            Поделиться
          </button>
        </div>
      </div>

      <div className="item_info">
        <div className="details">
          <InfoRow title="Owner" value={user?.name || "User Name"} />
          <InfoRow title="Type" value={ itemData.item_type || "Type"} />
          <div className="row">
            <div className="title">Rarity</div>
            <div className="value" style={{ color: `${itemData.rarity}`}}>{getRarityByHex(itemData.rarity)}</div>
          </div>
          <InfoRow
            title="Coin Price"
            value={<>{itemData.price_coin} <IconCoin /></>}
          />
          <InfoRow title="USD Price" value={`${itemData.price_usd} $`} />
          <InfoRow
            title="Status"
            value={
              <span style={{ color: statusInfo.color }}>
                {statusInfo.label}
              </span>
            }
          />
        </div>
      </div>

      <div className="btns">
        <button
          className="sell_btn"
          onClick={handleSell}
          disabled={itemData.status !== 0}
        >
          {statusInfo.label === "В наличии" ? "Продать" : statusInfo.label}
        </button>
      </div>
    </section>
  );
};

export default PageItem;

// Строка информации
function InfoRow({ title, value }) {
  return (
    <div className="row">
      <div className="title">{title}</div>
      <div className="value">{value}</div>
    </div>
  );
}
