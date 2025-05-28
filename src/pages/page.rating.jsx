// pages/purchase.success.jsx
import "../css/page.rating.css";
import NavBar from "../components/navbar"
import { useEffect, useState } from "react";

const mockData = [
  { id: 1, username: "Batya", items: 56, score: 126000 },
  { id: 2, username: "Triada", items: 48, score: 114500 },
  { id: 3, username: "PreFer", items: 45, score: 98000 },
  { id: 4, username: "Monesy", items: 44, score: 95025 },
  { id: 5, username: "Donk XLS", items: 41, score: 91000 },
  { id: 6, username: "Morgan 213", items: 39, score: 88300 },
  { id: 7, username: "Toronto GG", items: 37, score: 83500 },
  { id: 8, username: "Bernard Sup", items: 36, score: 82900 },
  { id: 9, username: "Hero CS", items: 32, score: 81230 },
  { id: 10, username: "Bogach YoYo", items: 29, score: 78515 },
];

const RatingRow = ({ rank, username, items, score }) => (
  <div className="row" id={`rank-${rank}`}>
    <div className="gr">
      <span className="rating_num">{rank}</span>
      <div className="user_name">{username}</div>
    </div>
    <div className="score">
      <span className="items_count">{items}</span>
      <span className="total_score">{score.toLocaleString()}</span>
    </div>
  </div>
);

const PageRating = () => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    // Здесь будет запрос к API, сейчас - мок
    setRatings(mockData);
  }, []);

  return (
    <section className="page_rating">
      <div className="container">
        <header className="header">
          <p>Рейтинг</p>
          <span>
            Выбивайте больше скинов и поднимайтесь по рейтингу, чтобы получать
            подарки!
          </span>
        </header>

        <div className="rating">
          {ratings.map((user, index) => (
            <RatingRow
              key={user.id}
              rank={index + 1}
              username={user.username}
              items={user.items}
              score={user.score}
            />
          ))}
        </div>
      </div>

      <NavBar />
    </section>
  );
};

export default PageRating;
