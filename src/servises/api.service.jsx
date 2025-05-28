// services/api.service.jsx
import axios from 'axios';

const api = axios.create({
  baseURL: "https://crmbot.uz/",
  timeout: 10000,
});

/**
 * Получение пользователя по tg_id
 * @param {string|number} tgId - Telegram ID пользователя
 * @returns {Promise<Object>} - объект пользователя
 */
export const getUserById = async (tgId) => {
  try {
    const response = await api.get('/users/get_id/', {
      params: { tg_id: tgId },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    throw error;
  }
};
// getUsers (all)
export const getUsers = async () => {
  try {
    const response = await api.get('/users/');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    throw error;
  }
};
// getItemById (id)
export const getItemById = async (id) => {
  try {
    const response = await api.get('/skins/' + id);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении предмета:', error);
    throw error;
  }
};


// PATCH


/**
 * Частичное обновление данных пользователя по Telegram ID
 * @param {number|string} tgId - Telegram ID пользователя
 * @param {Object} partialData - Объект с полями, которые нужно изменить
 * @returns {Promise<Object>} - Обновлённый пользователь
 */
export const updateUserPartial = async (tgId, partialData) => {
  try {
    const response = await api.patch(`/users/get_id/?tg_id=${tgId}`, partialData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при частичном обновлении пользователя:', error);
    throw error;
  }
};


export const getCoinPriceList = async () => {
  try {
    const response = await api.get('/coin/');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    throw error;
  }
};

export const getPaymentCards = async () => {
  try {
    const response = await api.get('/payment/');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    throw error;
  }
};

export const getTaskList = async () => {
  try {
    const response = await api.get('/channels/');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    throw error;
  }
};


export const getCasesList = async () => {
  try {
    const response = await api.get('/cases/');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    throw error;
  }
};

export const postDropSkin = async (telegram_id, skin_id, case_id) => {
  try {
    const response = await api.post('/users/drop_skin/', {
      telegram_id,
      skin_id,
      case_id
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
    throw error;
  }
};

export const postSellItem = async (item_id) => {
  try {
    const response = await api.post('/users/sell_item/', {
      item_id
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
    throw error;
  }
};
