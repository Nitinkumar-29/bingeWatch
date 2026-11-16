import React, { useContext, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import MovieContext from "../Context/MovieContext";
import Pagination from "../Components/Pagination";
import { AiFillStar } from "react-icons/ai";

const MovieCard = ({ movie }) => (
  <div className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03]"
    style={{ border: "1px solid var(--card-border)", transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(59,130,246,0.2)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.boxShadow = "none"; }}
  >
    <Link to={`/movie/${movie.id}`}>
      <img
        className="w-full h-72 object-cover"
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
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
        className="text-sm font-medium hover:text-blue-500 transition-colors duration-200 line-clamp-1"
        style={{ color: "var(--text)" }}>
        {movie.title?.length > 28 ? `${movie.title.slice(0, 28)}...` : movie.title}
      </Link>
      <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{movie.release_date}</p>
    </div>
  </div>
);

const Home = () => {
  const { page, setPage, homePageMovieData, popularMovies, totalPages } = useContext(MovieContext);

  useEffect(() => {
    homePageMovieData();
    // eslint-disable-next-line
  }, [page]);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Hero Carousel */}
      <div className="relative">
        <Carousel showThumbs={false} autoPlay transitionTime={800} infiniteLoop
          showStatus={false} useKeyboardArrows showArrows={false} interval={5000}>
          {popularMovies?.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`}>
              <div className="relative h-[55vh] md:h-[75vh]">
                <img className="w-full h-full object-cover"
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                  alt={movie.title} />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to right, var(--overlay-l) 35%, var(--overlay-r) 70%)" }} />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, var(--overlay-b) 0%, transparent 40%)" }} />
                <div className="absolute bottom-12 left-8 md:left-14 text-left max-w-lg">
                  <h1 className="text-2xl md:text-4xl font-bold mb-2 text-glow" style={{ color: "var(--text)" }}>
                    {movie.title}
                  </h1>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                      <AiFillStar /> {Math.round(movie.vote_average * 10) / 10}
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {movie.release_date?.slice(0, 4)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-3 hidden md:block" style={{ color: "var(--text-muted)" }}>
                    {movie.overview}
                  </p>
                  <div className="mt-4 inline-block px-5 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "rgba(59,130,246,0.85)", border: "1px solid rgba(59,130,246,0.5)" }}>
                    View Details →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Carousel>
      </div>

      {/* Popular Movies Grid */}
      <div className="px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text)" }}>Popular Movies</h2>
            <div className="h-0.5 w-16 mt-1 rounded-full bg-blue-500" />
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); homePageMovieData(p); }} />
        </div>

        {popularMovies && popularMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
