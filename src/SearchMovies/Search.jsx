import React, { useContext, useEffect } from "react";
import MovieContext from "../Context/MovieContext";
import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

const Search = () => {
  const { searchResults, loading, query } = useContext(MovieContext);

  useEffect(() => {
    if (!loading && searchResults.length > 0) {
      localStorage.setItem("searchResults", JSON.stringify(searchResults));
    }
  }, [searchResults, loading]);

  return (
    <div className="px-6 py-10" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text)" }}>
          {query ? `Results for "${query}"` : "Search Results"}
        </h2>
        <div className="h-0.5 w-16 mt-1 rounded-full bg-blue-500" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {searchResults.map((movie) => (
            <div key={movie.id} className="relative rounded-xl overflow-hidden cursor-pointer"
              style={{ border: "1px solid var(--card-border)", transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(59,130,246,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <Link to={`/movie/${movie.id}`}>
                <img
                  className="w-full h-72 object-cover"
                  src={movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                    : "https://image.tmdb.org/t/p/original/1wOu8rdvPxU1ObHi20VcRhfNpbo.jpg"}
                  alt={movie.title}
                />
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--overlay-b)", border: "1px solid rgba(59,130,246,0.4)" }}>
                  <AiFillStar className="text-yellow-400 text-xs" />
                  {movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : "N/A"}
                </div>
              </Link>
              <div className="p-3" style={{ background: "var(--card)" }}>
                <Link to={`/movie/${movie.id}`}
                  className="text-sm font-medium hover:text-blue-500 transition-colors duration-200"
                  style={{ color: "var(--text)" }}>
                  {movie.title?.length > 28 ? `${movie.title.slice(0, 28)}...` : movie.title}
                </Link>
                <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{movie.release_date}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <FiSearch className="text-blue-400 text-2xl" />
          </div>
          <p className="text-lg font-medium" style={{ color: "var(--text-muted)" }}>No results found</p>
          <p className="text-sm" style={{ color: "var(--text-faint)" }}>Try searching for a different movie title</p>
        </div>
      )}
    </div>
  );
};

export default Search;
