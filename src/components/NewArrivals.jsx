import React, { useState } from "react";
import "./MovieRow.css"; // ✅ Shared CSS

const initialArrivals = [
  {
    id: 1,
    title: "Oppenheimer",
    info: "Historical Thriller",
    poster: "/images/oppenheimer.jpg",
  },
  {
    id: 2,
    title: "Barbie",
    info: "Fantasy Comedy",
    poster: "/images/barbie.jpg",
  },
];

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState(initialArrivals);

  return (
    <div className="movie-row-container">
      <h2 className="movie-row-title">🆕 New Arrivals</h2>
      <div className="movie-row-scroll">
        {newArrivals.map((item) => (
          <div key={item.id} className="movie-card">
            {item.poster ? (
              <img src={item.poster} alt={item.title} />
            ) : (
              <div className="movie-info-overlay">
                <strong>{item.title}</strong>*/
                <p>{item.info}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
