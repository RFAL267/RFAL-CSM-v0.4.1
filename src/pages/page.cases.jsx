import "../css/page.cases.css"
import IconCoin from "../components/icons/icon.coin"
import NavBar from '../components/navbar'
import { useNavigate } from "react-router-dom"
import { getCasesList } from "../servises/api.service"
import { useEffect, useState } from "react"

const PageCases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await getCasesList();
        setCases(data); // сохраняем полученные кейсы
      } catch (error) {
        console.error('Ошибка при загрузке кейсов:', error);
      }
    };

    fetchCases();
  }, []);

  return (
    <section className="page_cases">
      <div className="page_title">
        <p>Кейсы</p>
        <article>
          Открывай кейсы и получай скины для Conter Strike 2
        </article>
      </div>

      {/* кейсы из API */}
<div className="cases">
  {cases
    .filter(item => item.is_active)  // показываем только активные кейсы
    .map(item => (
      <button className="case" key={item.id} onClick={() => navigate(`/case_spinner/${item.id}`)}>
        <img src={item.photo} alt={item.name} />
        <p className="title">{item.name}</p>
        <div className="price">
          <IconCoin />
          {item.price}
        </div>
      </button>
    ))
  }
</div>

      <NavBar />
    </section>
  );
};

export default PageCases;
