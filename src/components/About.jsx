// src/components/About.jsx
import React from "react";
import "./About.css"; // optional styling file

const About = () => {
  return (
    <div className="about-container">
      <h1>About Films On Video</h1>
      <p>
        <strong>Company Motto:</strong> “Unleash Your Entertainment.”
      </p>
      <p>
        Films On Video is dedicated to bringing you the best selection of movies, 
        adult titles, and beyond. Our specialty is in offering a curated catalog 
        that spans decades and genres, ensuring every film enthusiast can find 
        something they love.
      </p>
      <p>
        We pride ourselves on:
      </p>
      <ul>
        <li><strong>Extensive Library:</strong> From timeless classics to the latest hits.</li>
        <li><strong>Curated Staff Picks:</strong> Handpicked recommendations from our film experts.</li>
        <li><strong>Upcoming Releases:</strong> Stay ahead of the curve with advanced info on new titles.</li>
      </ul>
      <p>
        Whether you’re a casual viewer or a devoted cinephile, 
        <em>Films On Video</em> aims to be your one-stop shop for entertainment.
      </p>
      <h2>Our Specialties</h2>
      <p>
        <strong>Rare Finds & Collectibles:</strong> We track down special editions, 
        limited runs, and out-of-print titles.  
        <br />
        <strong>Expert Staff:</strong> Our team lives and breathes film. 
        We’re always happy to chat about recommendations or hidden gems.
      </p>
      <h2>Our Mission</h2>
      <p>
        To provide a platform that not only sells movies but also celebrates 
        the art of cinema. We believe in keeping physical media alive and 
        fostering a community of passionate movie lovers.
      </p>
    </div>
  );
};

export default About;
