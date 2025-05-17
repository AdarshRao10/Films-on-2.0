// src/components/RegularMovieDetail.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
//import regularData from "../RegularMovies.json"; // or "../RegularMovies.json"
import "./RegularMovieDetail.css";
import supabase from "../supabaseClient";


const RegularMovieDetail = () => {
  const { regSerialNo } = useParams(); // "index" from the route
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.page || 1;

  // useEffect(() => {
  //   const data = regularData["Sheet1"] || [];
  //   const movieItem = data[index]; // index is a string, but .map index is used, so this works
  //   setMovie(movieItem);
  // }, [index]);

  useEffect(() => {
    async function fetchMovie() {
     const { data: movieItem, error } = await supabase
        .from("Regular_titles")
        .select("*")
        .eq("RegSerialNo", parseInt(regSerialNo, 10))
        .single();
  
      if (error) console.error(error);
      else setMovie(movieItem);
      setLoading(false);
    }
    fetchMovie();
  }, [regSerialNo]);


  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found.</p>;

  const handleBack = () => {
    // pass back the fromPage
    navigate("/movies", { state: { page: fromPage } });
  };

  return (
    <div className="movie-detail-container">
      <img
        src={movie.PosterURL}
        alt={movie.Title}
        className="detail-poster"
      />
      <h1>{movie.Title}</h1>
      <p><strong>Year:</strong> {movie.Year}</p>
      <p><strong>Disc:</strong> {movie.Disc}</p>
      <p><strong>Price:</strong> ${movie.CurrentPrice}</p>
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Description:</strong> {movie.Description || "No description."}</p>

      {/* Back button => returns to previous page (preserving pagination, if used) */}
      {/* <button className="back-button" onClick={handleBack}>
        ← Back to Movies
      </button> */}
      <button onClick={handleBack}>← Back to Regular Titles</button>
    </div>
  );
};

export default RegularMovieDetail;
