// src/components/SearchBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import supabase from "../supabaseClient";

const SearchBar = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Toggle this based on your auth state
  const isAgeAuthenticated = false;

  const [isExpanded, setIsExpanded] = useState(false);
  const [query,      setQuery]      = useState("");
  const [results,    setResults]    = useState([]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsExpanded(false);
        setQuery("");
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    // Determine which table & PK to use
    const table = isAgeAuthenticated ? "Adult_titles" : "Regular_titles";
    const pk    = isAgeAuthenticated ? "AdultSerialNo" : "RegSerialNo";

    // Fetch matching titles
    const { data, error } = await supabase
      .from(table)
      .select(`*, ${pk}`)
      .ilike("Title", `%${value}%`)
      .limit(10);

    if (error) {
      console.error("Search error:", error);
      setResults([]);
    } else {
      setResults(data || []);
    }
  };

  const handleResultClick = (movie) => {
    const pk    = isAgeAuthenticated ? movie.AdultSerialNo : movie.RegSerialNo;
    const route = isAgeAuthenticated ? "/adult-movies/" : "/movies/";
    navigate(`${route}${pk}`, { state: { page: 1 } });
    setIsExpanded(false);
    setQuery("");
    setResults([]);
  };

  const handleSeeMore = () => {
    navigate(`/search?query=${encodeURIComponent(query)}`, {
      state: { isAdult: isAgeAuthenticated },
    });
    setIsExpanded(false);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="search-bar-container" ref={containerRef}>
      {!isExpanded ? (
        <input
          type="text"
          placeholder="Search"
          className="search-bar-compact"
          onFocus={handleExpand}
        />
      ) : (
        <div className="search-expanded">
          <input
            type="text"
            placeholder="Search films..."
            value={query}
            onChange={handleInputChange}
            className="search-input"
            autoFocus
          />

          {query && (
            <ul className="search-results">
              {results.map((movie) => (
                <li
                  key={isAgeAuthenticated ? movie.AdultSerialNo : movie.RegSerialNo}
                  onClick={() => handleResultClick(movie)}
                >
                  {movie.Title}
                </li>
              ))}

              {results.length === 0 && (
                <li className="empty-message">No matches found.</li>
              )}

              {results.length >= 10 && (
                <li className="see-more" onClick={handleSeeMore}>
                  See More Results
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
