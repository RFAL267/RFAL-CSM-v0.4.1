// page.purchase.success.jsx
import "../css/page.purchase.success.css";
import { useNavigate } from "react-router-dom";
import successGif from "../assets/gif/success.gif"

const PagePurchaseSuccess = () => {
  const navigate = useNavigate();

  return (
    <section className="page_purchase_success">
      <img src={successGif} />
      <p>Ваша заявка в обработке.</p>
      <span>Администраторы проверят вашу заявку.</span>
      <span>После подтверждения вашей заявки ваши монеты поступят на ваш счёт.</span>
      <button className="ok_btn" onClick={()=>{navigate("/")}}>
        OK
      </button>
    </section>
  );
};

export default PagePurchaseSuccess;
