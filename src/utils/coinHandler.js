// utils/coinHandler.js

export const MAX_CLICKS_PER_DAY = 100;

export const handleCoinClick = ({ balance, setBalance, clickCount, setClickCount }) => {
  if (clickCount >= MAX_CLICKS_PER_DAY) {
    alert("Kunlik limitga yetdingiz (100). Ertaga qayta urinib ko‘ring.");
    return;
  }

  setBalance(balance + 1);
  setClickCount(clickCount + 1);
};
