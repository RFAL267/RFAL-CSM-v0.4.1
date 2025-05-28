import { useEffect, useState } from "react";

const DebugLogger = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    setData({
      available: !!tg,
      initData: tg?.initData || "нет",
      user: tg?.initDataUnsafe?.user || "нет данных",
    });
  }, []);

  return (
    <div style={{ background: "#111", color: "#0f0", padding: 10, fontSize: 12 }}>
      <div><strong>Telegram доступен:</strong> {data?.available ? "да" : "нет"}</div>
      <div><strong>initData:</strong> {JSON.stringify(data?.initData)}</div>
      <div><strong>user:</strong> {typeof data?.user === "string" ? data.user : JSON.stringify(data.user)}</div>
    </div>
  );
};

export default DebugLogger;
