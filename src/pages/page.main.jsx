import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import IconCoin from "../components/icons/icon.coin";
import NavBar from "../components/navbar";
import svgTapMe from "../assets/svg/tapme.svg";
import "../css/page.main.css";

import {
  getUserById,
  updateUserPartial,
  getTaskList,
} from "../servises/api.service";

import { handleCoinClick } from "../utils/coinHandler";
import { useUser } from "../context/UserContext";

// Константы
const MAX_CLICKS_PER_DAY = 100;
const getTodayDate = () => new Date().toISOString().split("T")[0];
const isDateBeforeToday = (dateStr) => !dateStr || new Date(dateStr) < new Date(getTodayDate());

const PageMain = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const userId = user?.id || 6032665836;

  const [userData, setUserData] = useState(null);
  const [balance, setBalance] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(null);
  const [taskList, setTaskList] = useState([]);

  // Получение данных пользователя
  const fetchUser = useCallback(async () => {
    try {
      const fetchedUser = await getUserById(userId);
      const today = getTodayDate();
      const resetNeeded = isDateBeforeToday(fetchedUser.last_click_reset);

      const updatedUser = {
        ...fetchedUser,
        clicks_today: resetNeeded ? 0 : fetchedUser.clicks_today || 0,
        last_click_reset: resetNeeded ? today : fetchedUser.last_click_reset,
      };

      if (resetNeeded) {
        await updateUserPartial(userId, {
          clicks_today: 0,
          last_click_reset: today,
        });
      }

      setUserData(updatedUser);
      setBalance(updatedUser.balance || 0);
      setClickCount(updatedUser.clicks_today);
      setLastResetDate(updatedUser.last_click_reset);
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
    }
  }, [userId]);

  // Получение заданий
  const fetchTasks = useCallback(async () => {
    try {
      const tasks = await getTaskList();
      setTaskList(tasks);
    } catch (error) {
      console.error("Ошибка загрузки заданий:", error);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchTasks();
    }
  }, [userId, fetchUser, fetchTasks]);

  // Обработка клика по монете
  const handleCoinClickWrapper = async () => {
    const today = getTodayDate();

    if (isDateBeforeToday(lastResetDate)) {
      setClickCount(0);
      setLastResetDate(today);

      try {
        await updateUserPartial(userId, {
          clicks_today: 0,
          last_click_reset: today,
        });
      } catch (error) {
        console.error("Ошибка сброса кликов:", error);
      }
    }

    if (clickCount >= MAX_CLICKS_PER_DAY) {
      alert("Вы достигли дневного лимита (100 кликов)");
      return;
    }

    const newBalance = balance + 1;
    const newClickCount = clickCount + 1;

    handleCoinClick({ balance, setBalance, clickCount, setClickCount });

    try {
      await updateUserPartial(userId, {
        balance: newBalance,
        clicks_today: newClickCount,
      });
    } catch (error) {
      console.error("Ошибка обновления пользователя:", error);
    }
  };

  // Приглашение друга
  const handleInviteClick = () => {
    const bot = "My_Tw0_Bot";
    const link = `https://t.me/${bot}?start=ref${userId}`;
    const text = encodeURIComponent(`Присоединяйтесь в CSM и получите бонус!\n${link}`);
    window.location.href = `https://t.me/share/url?url=${text}`;
  };

  // Получение id выполненных заданий
  const completedTaskIds = userData?.tasks?.filter(t => t.status).map(t => t.id) || [];

  return (
    <section className="page_main">
      {/* Монета и описание */}
      <div className="coin_info">
        <button className="coin_btn" onClick={handleCoinClickWrapper}>
          <IconCoin />
        </button>
        <img className="tapme" src={svgTapMe} alt="Tap me" />
        <p>CSM Coins</p>
        <article>
          Зарабатывай монеты и меняй их на кейсы, стикеры и скины для Counter Strike 2.
        </article>
      </div>

      {/* Баланс */}
      <div className="balance">
        <button className="counter" onClick={handleCoinClickWrapper}>
          <IconCoin />
          <span>{balance}</span>
        </button>
        <p>твой баланс</p>
        <button className="balance_btn" onClick={() => navigate("/buy")}>
          Пополнить Баланс
        </button>
      </div>

      {/* Задания */}
      <div className="tasks">
        <p>VAZIFALAR</p>
        <div className="list">
          {/* Приглашение друга */}
          <div className="task">
            <div className="content">
              <p>Пригласи друга, который играет в CS</p>
              <div className="prize">
                <span>+500</span>
                <IconCoin />
              </div>
            </div>
            <button className="btn" onClick={handleInviteClick}>
              Пригласить
            </button>
          </div>

          {/* Список остальных заданий */}
          {taskList.map((task) => {
            const isCompleted = completedTaskIds.includes(task.id);
            return (
              <div className="task" key={task.id}>
                <div className="content">
                  <p>{task.name}</p>
                  <div className="prize">
                    <span>+{task.reward_amount}</span>
                    <IconCoin />
                  </div>
                </div>
                {isCompleted ? (
                  <span className="complete">Выполнено</span>
                ) : (
                  <a
                    className="btn"
                    href={task.invite_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Подписаться
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <NavBar />
    </section>
  );
};

export default PageMain;
