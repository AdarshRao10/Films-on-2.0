// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import "./MovieList.css"; // shared styles
// import supabase from "../supabaseClient";
// import { useCart } from "../context/CartContext";

// const RegularMovies = () => {
//   const location = useLocation();
//   const initialPage = location.state?.page || 1;
//   const [filterDisc, setFilterDisc] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const { addToCart } = useCart();
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(initialPage);
//   const moviesPerPage = 21;

//   useEffect(() => {
//     async function fetchData() {
//       const { data, error } = await supabase.from("Regular_titles").select("*");
//       if (error) {
//         console.error("Error fetching data:", error.message || error);
//       } else {
//         setMovies(data);
//       }
//       setLoading(false);
//     }
//     fetchData();
//   }, []);

//   if (loading) return <div>Loading Regular Movies...</div>;

//   const getFilteredAndSortedMovies = () => {
//     let temp = [...movies];
//     if (filterDisc) temp = temp.filter((movie) => movie.Disc === filterDisc);
//     switch (sortOption) {
//       case "title-asc":
//         temp.sort((a, b) => a.Title.localeCompare(b.Title));
//         break;
//       case "title-desc":
//         temp.sort((a, b) => b.Title.localeCompare(a.Title));
//         break;
//       default:
//         break;
//     }
//     return temp;
//   };

//   const filteredMovies = getFilteredAndSortedMovies();
//   const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
//   const indexOfLastMovie = currentPage * moviesPerPage;
//   const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
//   const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handleAddToCart = (movie) => {
//     addToCart(movie);
//     alert(`Added "${movie.Title}" to your cart!`);
//   };

//   return (
//     <div className="movies-container content">
//       <h2>Regular Movies</h2>
//       <p className="click-instruction">👉 Click the movies you would like to add to the cart.</p>

//       <div className="filter-sort-bar">
//         <label htmlFor="discFilter">Disc Type:</label>
//         <select
//           id="discFilter"
//           value={filterDisc}
//           onChange={(e) => {
//             setFilterDisc(e.target.value);
//             setCurrentPage(1);
//           }}
//         >
//           <option value="">All</option>
//           <option value="DVD">DVD</option>
//           <option value="Blu-ray">Blu-ray</option>
//           <option value="4K/Blu-ray">4K/Blu-ray</option>
//           <option value="Collections">Collections</option>
//         </select>

//         <label htmlFor="sortOption">Sort by:</label>
//         <select
//           id="sortOption"
//           value={sortOption}
//           onChange={(e) => {
//             setSortOption(e.target.value);
//             setCurrentPage(1);
//           }}
//         >
//           <option value="">None</option>
//           <option value="title-asc">Title (A-Z)</option>
//           <option value="title-desc">Title (Z-A)</option>
//         </select>
//       </div>

//       <div className="movie-list">
//         {currentMovies.map((movie, index) => {
//           const absoluteIndex = indexOfFirstMovie + index;

//           return (
//             <div
//               className="movie-card clickable-card"
//               key={absoluteIndex}
//               onClick={() => handleAddToCart(movie)}
//               title="Click to add to cart"
//             >
//               <img
//                 src={movie.PosterURL || "https://via.placeholder.com/150"}
//                 alt={movie.Title}
//                 className="movie-poster"
//               />
//               <h3>{movie.Title}</h3>
//               <p>{movie.Genre} • {movie.Year}</p>
//               <p>{movie.Disc}</p>
//               <p>Price: ${movie.CurrentPrice}</p>
//               <Link
//                 to={`/movies/${movie.RegSerialNo}`}
//                 state={{ page: currentPage }}
//                 className="detail-button"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 More Detail
//               </Link>
//             </div>
//           );
//         })}
//       </div>

//       {totalPages > 1 && (
//         <div className="pagination-container">
//           <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First</button>
//           <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1)
//             .slice(
//               Math.max(0, currentPage - 3),
//               Math.min(totalPages, currentPage + 2)
//             )
//             .map((num) => (
//               <button
//                 key={num}
//                 onClick={() => handlePageChange(num)}
//                 className={num === currentPage ? "active" : ""}
//               >
//                 {num}
//               </button>
//             ))}
//           <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
//           <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RegularMovies;



// src/components/RegularMovies.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MovieList.css";
import supabase from "../supabaseClient";
import { useCart } from "../context/CartContext";

const RegularMovies = () => {
  const { state } = useLocation();
  const initialPage = state?.page || 1;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDisc, setFilterDisc] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const moviesPerPage = 21;
  const { addToCart } = useCart();

  useEffect(() => {
    supabase
      .from("Regular_titles")
      .select("*")
      .order("RegSerialNo", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setMovies(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Regular Movies…</div>;

  const filteredSorted = () => {
    let tmp = [...movies];
    if (filterDisc) tmp = tmp.filter((m) => m.Disc === filterDisc);
    if (sortOption === "title-asc")
      tmp.sort((a, b) => a.Title.localeCompare(b.Title));
    if (sortOption === "title-desc")
      tmp.sort((a, b) => b.Title.localeCompare(a.Title));
    return tmp;
  };

  const filtered = filteredSorted();
  const totalPages = Math.ceil(filtered.length / moviesPerPage);
  const start = (currentPage - 1) * moviesPerPage;
  const current = filtered.slice(start, start + moviesPerPage);

  const handlePageChange = (page) => {
           if (page >= 1 && page <= totalPages) {
             setCurrentPage(page);
             window.scrollTo(0, 0);
           }
         };
  
         const handleAddToCart = (movie) => {
           addToCart(movie);
           alert(`Added "${movie.Title}" to your cart!`);
         };

  return (
    <div className="movies-container content">
      <h2>Regular Movies</h2>
      <div className="filter-sort-bar">
        <label>Disc:</label>
        <select onChange={(e) => { setFilterDisc(e.target.value); setCurrentPage(1); }}>
          <option value="">All</option>
          <option>DVD</option>
          <option>Blu-ray</option>
          <option>4K/Blu-ray</option>
          <option>Collections</option>
        </select>

        <label>Sort:</label>
        <select onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}>
          <option value="">None</option>
          <option value="title-asc">A→Z</option>
          <option value="title-desc">Z→A</option>
        </select>
      </div>

      <div className="movie-list">
        {current.map((movie) => (
          <div key={movie.RegSerialNo} className="movie-card">
            {/* --- BODY (click to add to cart) --- */}
            <div
              className="card-body"
              onClick={() => {
                addToCart(movie, false);
                alert(`Added "${movie.Title}" to your cart!`);
              }}
            >
              <img
                src={movie.PosterURL || "https://via.placeholder.com/150"}
                alt={movie.Title}
                className="movie-poster"
              />
              <h3>{movie.Title}</h3>
              <p>{movie.Genre} • {movie.Year}</p>
              <p>{movie.Disc}</p>
              <p>${movie.CurrentPrice}</p>
            </div>

            {/* --- FOOTER (always visible) --- */}
            <div className="card-footer">
              <Link
                to={`/movies/${movie.RegSerialNo}`}
                state={{ page: currentPage }}
                className="detail-button"
              >
                More Detail
              </Link>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First</button>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
           {Array.from({ length: totalPages }, (_, i) => i + 1)
               .slice(
                 Math.max(0, currentPage - 3),
                 Math.min(totalPages, currentPage + 2)
               )
               .map((num) => (
                 <button
                   key={num}
                   onClick={() => handlePageChange(num)}
                   className={num === currentPage ? "active" : ""}
                 >
                   {num}
                 </button>
               ))}
             <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
             <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last</button>
           </div>
         )}
    </div>
  );
};

export default RegularMovies;

