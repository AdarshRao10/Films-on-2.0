import React, { useState } from "react";
import "./MovieRow.css"; // ✅ Shared CSS

const initialStaffPicks = [
  {
    id: 1,
    title: "Inception",
    info: "Mind-bending sci-fi",
    poster: "/images/inception.jpg",
  },
  {
    id: 2,
    title: "The Godfather",
    info: "Classic mafia drama",
    poster: "/images/godfather.jpg",
  },
];

const StaffPicks = () => {
  const [staffPicks, setStaffPicks] = useState(initialStaffPicks);

  return (
    <div className="movie-row-container">
      <h2 className="movie-row-title">👑 Staff Picks</h2>
      <div className="movie-row-scroll">
        {staffPicks.map((item) => (
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

export default StaffPicks;
