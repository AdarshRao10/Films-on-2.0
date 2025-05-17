// src/components/AdultMovieDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import supabase from "../supabaseClient";
import "./RegularMovieDetail.css"; // you can share styles

const AdultMovieDetail = () => {
  const { adultSerialNo } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fromPage = useLocation().state?.page || 1;

  useEffect(() => {
    async function fetchMovie() {
      const { data: movieItem, error } = await supabase
        .from("Adult_titles")
        .select("*")
        .eq("AdultSerialNo", parseInt(adultSerialNo, 10))
        .single();
  
      if (error) console.error(error);
      else setMovie(movieItem);
      setLoading(false);
    }
    fetchMovie();
  }, [adultSerialNo]);

  if (loading) return <p>Loading…</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="movie-detail-container">
      <img src={movie.PosterURL} alt={movie.Title} className="detail-poster" />
      <h1>{movie.Title}</h1>
      <p><strong>Year:</strong> {movie.Year}</p>
      <p><strong>Disc:</strong> {movie.Disc}</p>
      <p><strong>Price:</strong> ${movie.CurrentPrice}</p>
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Description:</strong> {movie.Description || "No description."}</p>
      <button onClick={() => navigate("/adult-movies", { state: { page: fromPage } })}>
        ← Back to Adult Titles
      </button>
    </div>
  );
};

export default AdultMovieDetail;

