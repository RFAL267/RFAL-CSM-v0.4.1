import "../css/page.withdraw.css";
import gif from "../assets/gif/arrow_down.gif";
import { useNavigate, useParams } from "react-router-dom";
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';
import axios from "axios"; // добавь этот импорт, если его ещё нет

import { useEffect, useState } from "react";
import { getUserById, updateUserPartial } from "../servises/api.service";
import { useUser } from "../context/UserContext";

const PageWithdraw = () => {
  const [userData, setUserData] = useState(null);
  const [tradeLink, setTradeLink] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();
  const { item_id } = useParams();
  const user_id = user?.id || 6032665836;

  const isWithdrawMode = Boolean(item_id);

  useTelegramBackButton(() => navigate(-1));

  useEffect(() => {
    getUserById(user_id)
      .then((data) => {
        setUserData(data);
        setTradeLink(data?.trade_link || "");
      })
      .catch(console.error);
      
  }, [user_id]);


  const handleSaveLink = async () => {
    try {
      await updateUserPartial(user_id, { trade_link: tradeLink });
      alert("Ссылка успешно сохранена");
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении ссылки");
    }
  };

const handleWithdraw = async () => {
  if (!tradeLink || !item_id) {
    return alert("Введите ссылку и выберите предмет");
  }

  const inventoryItem = userData?.inventory?.find(
    (item) => item.id === Number(item_id)
  );

  if (!inventoryItem) {
    return alert("Предмет не найден в инвентаре");
  }

  const skinId = inventoryItem.skin.id;

  try {
    const payload = {
      skin_id: skinId,
      user_id,
      trade_link: tradeLink,
      withdraw: true,
    };

    const response = await axios.post("https://crmbot.uz/skins/purchase/", payload);
    console.log("Ответ сервера:", response.data);

    // Если сервер вернул сообщение — покажем его
    const message = response.data?.message || "Предмет отправлен на обмен";
    alert(message);

    // Перенаправляем, если всё успешно
    // navigate("/profile");
  } catch (err) {
    console.error("Ошибка при выводе:", err);
    const errorMessage =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Не удалось отправить предмет";
    alert(errorMessage);
  }
};



  return (
    <section className="page_withdraw">
      <div className="link_form">
        <img src={gif} alt="arrow" />
        <p>Куда отправлять предметы?</p>
        <span>
          Кейсы, стикеры и наклейки отправляются с помощью ссылки обмена. Найди свою ссылку обмена
          <font> на странице обмена в Steam</font>
        </span>

        <textarea
          name="user_steam_trade"
          id="withdraw_form"
          placeholder="https://steamcommunity.com/tradeoffer/new/?partner=1234567890&token=FlAx91il"
          rows="4"
          value={tradeLink}
          onChange={(e) => setTradeLink(e.target.value)}
        />

        <button className="send_btn" onClick={isWithdrawMode ? handleWithdraw : handleSaveLink}>
          {isWithdrawMode ? "Вывести" : "Сохранить"}
        </button>
      </div>
    </section>
  );
};

export default PageWithdraw;
