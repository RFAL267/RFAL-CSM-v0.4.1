import { useEffect } from 'react';

export function useTelegramBackButton(callback) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    // Проверка доступности Telegram API
    if (!tg || !tg.BackButton || typeof callback !== 'function') {
      console.warn('Telegram WebApp API или callback недоступны');
      return;
    }

    // Показываем кнопку назад
    tg.BackButton.show();

    // Назначаем обработчик
    tg.BackButton.onClick(callback);

    // Очистка
    return () => {
      tg.BackButton.offClick(callback);
      tg.BackButton.hide();
    };
  }, [callback]);
}
