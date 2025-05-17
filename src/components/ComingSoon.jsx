import React, { useState } from "react";
import "./MovieRow.css"; // ✅ Shared CSS

const initialComingSoon = [
  {
    id: 1,
    title: "Guardians of the Galaxy Vol. 3",
    info: "Marvel cosmic fun",
    poster: "/images/guardians3.jpg",
  },
  {
    id: 2,
    title: "Mission Impossible: Dead Reckoning",
    info: "Tom Cruise action",
    poster: "/images/missionimpossible.jpg",
  },
];

const ComingSoon = () => {
  const [comingSoon, setComingSoon] = useState(initialComingSoon);

  return (
    <div className="movie-row-container">
      <h2 className="movie-row-title">🎬 Coming Soon</h2>
      <div className="movie-row-scroll">
        {comingSoon.map((item) => (
          <div key={item.id} className="movie-card">
            {item.poster ? (
              <img src={item.poster} alt={item.title} />
            ) : (
              <div className="movie-info-overlay">
                <strong>{item.title}</strong>
                <p>{item.info}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;
