// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import supabase from "../supabaseClient";

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [comingSoon,  setComingSoon]  = useState([]);
  const [staffPicks,  setStaffPicks]  = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // 1) New Arrivals:  → newest 12
      const { data: arrivals } = await supabase
        .from("Regular_titles")
        .select("*")
        .order("Release Year", { ascending: true })
        .limit(12);
      setNewArrivals(arrivals || []);

      // 2) Coming Soon: Type LIKE '%Upcoming%' (may be empty)
      const { data: upcoming } = await supabase
        .from("Regular_titles")
        .select("*")
        .like("Type", "%Upcoming%")
        .order("RegSerialNo", { ascending: false })
        .limit(12);
      setComingSoon(upcoming || []);

      // 3) Staff Picks: top 5 newest by RegSerialNo
      const { data: picks } = await supabase
        .from("Regular_titles")
        .select("*")
        .order("RegSerialNo", { ascending: false })
        .limit(5);
      setStaffPicks(picks || []);
    };
    fetchData();
  }, []);

  const renderCarousel = (title, movies) => (
    <div className="carousel-section">
      <h2>{title}</h2>
      <div className="scroll-container">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Link
              key={movie.RegSerialNo}
              to={`/movies/${movie.RegSerialNo}`}
              className="poster-card"
            >
              <img
                src={movie.PosterURL || "/images/default-poster.jpg"}
                alt={movie.Title}
                className="poster-image"
              />
            </Link>
          ))
        ) : (
          <p className="empty-message">No {title.toLowerCase()} available.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-overlay">
          <h1>Movies, Games, and More</h1>
          <p>Welcome to FilmsOnVideo, your one-stop shop for all entertainment!</p>
        </div>
      </div>

      {/* ✨ Poster Carousels */}
      {renderCarousel("New Arrivals", newArrivals)}
      {renderCarousel("Coming Soon",  comingSoon)}
      {renderCarousel("Staff Picks",  staffPicks)}

      <div className="intro-section1">
        <div>
          <img
            src="/images/oppenheimer.jpg"
            alt="Introduction"
            className="intro-image1"
          />
        </div>
        <div className="intro-text1">
          <h2>About Films-On-Video</h2>
          <p>
            OnVideo is dedicated to bringing you the best in movies, adult movies,
            and more. We source the latest releases and timeless classics, ensuring
            there's something for everyone in our extensive library.
          </p>
          <p>
            If you're a film enthusiast, our mission is to
            provide top-quality entertainment at your fingertips. Explore our new
            arrivals, check out staff picks, or dive into our upcoming releases to
            plan your next watch or play session!
          </p>   
          <Link to="/about" className="detail-button">
            Read More
          </Link>        
        </div>
      </div> 

      <div className="intro-section1">
        <div>
          <img
            src="/images/Poster.jpg"
            alt="Introduction"
            className="intro-image1"
          />
        </div>
        <div className="intro-text1">
          <h3><i>Collect</i></h3>
          <h1>Entertainment Memorabilia</h1>
          <p>
            OnVideo has all sorts of memorabilia for your collecting pleasure!
            We have posters, VHS tapes, special-edition board games, action figures,
            chibis, and more!
          </p>            
        </div>
      </div>

      {/* <div className="intro-section1">
        <div>
          <img
            src="/images/moviePoster.jpg"
            alt="Introduction"
            className="intro-image1"
          />
        </div>
        <div className="intro-text1">
          <h3><i>Collect</i></h3>
          <h1>Entertainment Memorabilia</h1>
          <p>
            OnVideo has all sorts of memorabilia for your collecting pleasure!
            We have posters, VHS tapes, special-edition board games, action figures,
            chibis, and more!
          </p>            
        </div>
      </div> */}
    </div>
  );
};

export default Home;
