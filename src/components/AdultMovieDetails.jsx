// // src/components/AdultMovieDetails.jsx
// import React from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import './MovieDetails.css';

// const AdultMovieDetails = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();

//   const movie = location.state?.movie;

//   if (!movie) {
//     return (
//       <div className="details-container">
//         <h2>Movie not found</h2>
//         <button onClick={() => navigate(-1)}>Go Back</button>
//       </div>
//     );
//   }

//   const handleAddToCart = () => {
//     addToCart(movie);
//     alert(`Added "${movie.Title}" to your cart!`);
//   };

//   return (
//     <div className="details-container">
//       <h2>{movie.Title}</h2>
//       <img
//         src={movie.PosterURL || 'https://via.placeholder.com/300'}
//         alt={movie.Title}
//         className="details-poster"
//       />
//       <p><strong>Year:</strong> {movie.Year}</p>
//       <p><strong>Production House:</strong> {movie.Production}</p>
//       <p><strong>Price:</strong> ${movie.Price}</p>
//       <p><strong>IMDB Rating:</strong> ⭐ 7.3/10 (placeholder)</p>
//       <p><strong>Availability:</strong> In Stock</p>

//       <button className="add-to-cart" onClick={handleAddToCart}>
//         Add to Cart
//       </button>

//       <button className="back-button" onClick={() => navigate(-1)}>
//         ← Back
//       </button>
//     </div>
//   );
// };

// export default AdultMovieDetails;
