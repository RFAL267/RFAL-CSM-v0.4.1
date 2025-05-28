import "../css/page.buy.css";
import IconCoin from "../components/icons/icon.coin";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCoinPriceList } from "../servises/api.service";

import { useTelegramBackButton } from '../hooks/useTelegramBackButton';

// Функция для форматирования числа с разделителями
const formatNumber = (num) => {
  return num.toLocaleString("ru-RU");
};

const PageBuy = () => {
  const navigate = useNavigate();
  const [priceList, setPriceList] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getCoinPriceList();
        setPriceList(data);
      } catch (error) {
        console.error("Не удалось загрузить список цен:", error);
      }
    };

    fetchPrices();
  }, []);

  useTelegramBackButton(() => {
    navigate(-1); // перейти назад
  });

  return (
    <section className="page_buy">
      <div className="header">
        <IconCoin />
        <div className="gr">
          <p>Купить</p>
          <article>Выберите количество монет для покупки</article>
        </div>
      </div>

      {/* buy packs from API */}
      <div className="packs">
        {priceList.map((pack) => (
          <button
            className="pack"
            key={pack.id}
            onClick={() => navigate(`/purchase/${pack.id}`)}
          >
            <div className="coins">
              <IconCoin />
              <span className="count">{formatNumber(pack.coin_count)}</span>
            </div>
            <span className="price">{formatNumber(pack.coin_price)} UZS</span>
          </button>
        ))}
      </div>

      <p className="info_text">
        При покупке монет вы соглащаетесь на условия <span>CSM</span>.
      </p>
    </section>
  );
};

export default PageBuy;
