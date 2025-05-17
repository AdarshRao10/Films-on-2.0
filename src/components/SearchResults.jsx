// // src/components/SearchResults.jsx
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import adultMoviesData from "../AdultMovies.json";
// import regularMoviesData from "../RegularMovies.json";

// const SearchResults = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Read query from ?query= in the URL
//   const params = new URLSearchParams(location.search);
//   const query = params.get("query") || "";

//   // Merge adult + regular movies
//   const adultMovies = adultMoviesData["Sheet2"] || [];
//   const regularMovies = regularMoviesData["Sheet1"] || [];
//   const allMovies = [...adultMovies, ...regularMovies];

//   // Filter based on the query
//   const filteredMovies = query.trim()
//     ? allMovies.filter((movie) =>
//         movie.Title?.toLowerCase().includes(query.toLowerCase())
//       )
//     : [];

//   const handleResultClick = (movie) => {
//     navigate(`/movie/${movie.SerialNo}`, { state: movie });
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Search Results for: <em>{query}</em></h2>
//       {filteredMovies.length === 0 ? (
//         <p>No results found.</p>
//       ) : (
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {filteredMovies.map((movie, index) => (
//             <li
//               key={movie.SerialNo || index}
//               style={{ margin: "8px 0", cursor: "pointer" }}
//               onClick={() => handleResultClick(movie)}
//             >
//               {movie.Title}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SearchResults;