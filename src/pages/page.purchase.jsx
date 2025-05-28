import "../css/page.purchase.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { getCoinPriceList, getPaymentCards } from "../servises/api.service";

import IconCoin from "../components/icons/icon.coin";
import IconImgUpload from "../components/icons/icon.img.upload";
import arrowRightGif from "../assets/gif/arrow_down.gif";

import { useUser } from "../context/UserContext"; // ← подключаем контекст

import { useTelegramBackButton } from '../hooks/useTelegramBackButton';


const formatNumber = (num) => num.toLocaleString("ru-RU");
// 

const user_id = 767560862;

// 
const PagePurchase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser(); // ← получаем данные пользователя

  const api = axios.create({
    baseURL: "https://crmbot.uz/",
    timeout: 10000,
  });

  useTelegramBackButton(() => {
    navigate(-1); // перейти назад
  });

  const [priceList, setPriceList] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [paymentCards, setPaymentCards] = useState([]);

  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prices = await getCoinPriceList();
        setPriceList(prices);

        const found = prices.find((pack) => String(pack.id) === String(id));
        setSelectedPack(found);
      } catch (err) {
        console.error("Ошибка при загрузке цен:", err);
      }

      try {
        const cards = await getPaymentCards();
        setPaymentCards(cards.filter((card) => card.is_active));
      } catch (err) {
        console.error("Ошибка при загрузке карт:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setScreenshot(file);
  };

  const handleSubmit = async () => {
  const isDev = import.meta.env.DEV; // true на локалке (vite)

  const telegramId = isDev ? user_id : user?.id;

  if (!telegramId || (!isDev && !user?.isTelegram)) {
    setError("Telegram foydalanuvchisi aniqlanmadi.");
    return;
  }

  if (!screenshot) {
    setError("Iltimos, kvitansiya rasmni yuklang.");
    return;
  }

  setIsSubmitting(true);
  setError(null);

  const formData = new FormData();
  formData.append("telegram_id", telegramId);
  formData.append("photo", screenshot);
  formData.append("coin_price", selectedPack.coin_price);
  formData.append("coin_count", selectedPack.coin_count);

  try {
    const res = await api.post("users/submit_coin_purchase/", formData);
    console.log("Успешно отправлено:", res.data);

    alert("So'rov yuborildi!");
    navigate("/purchase_success");
  } catch (err) {
    console.error("Xatolik:", err);
    setError("Yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
  } finally {
    setIsSubmitting(false);
  }
};

  if (!selectedPack) return <div className="loading">Загрузка...</div>;

  return (
    <section className="page_purchase">
      <div className="payment_cards">
        {paymentCards.length === 0 ? (
          <p>Карт для оплаты нет</p>
        ) : (
          paymentCards.map((card) => (
            <div className="row" key={card.id}>
              <small>{card.title}</small>
              <p>{card.card_number}</p>
            </div>
          ))
        )}
      </div>

      <div className="head">
        <div className="price">{formatNumber(selectedPack.coin_price)} UZS</div>
        <img className="arrow_gif" src={arrowRightGif} alt="→" />
        <div className="count">
          {formatNumber(selectedPack.coin_count)} <IconCoin />
        </div>
      </div>

      <div className="form">
        <p>
          Отправьте <font>Скриншот</font> Квитанции вашей оплаты
        </p>
        <input
          type="file"
          name="receipt"
          id="screenshot"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        <label htmlFor="screenshot" className="file_btn">
          <IconImgUpload />
          <span>{screenshot ? "Загружено ✅" : "Загрузить"}</span>
        </label>

        {error && <p className="error">{error}</p>}

        <button
          className="submit_btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Отправляется..." : "Отправить"}
        </button>
      </div>
    </section>
  );
};

export default PagePurchase;
