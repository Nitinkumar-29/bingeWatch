import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FiClock, FiCalendar, FiPlay, FiUser } from "react-icons/fi";
import { MdAttachMoney, MdTrendingUp, MdMovieFilter } from "react-icons/md";
import Pagination from "./Pagination";

const API_HEADERS = {
  accept: "application/json",
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZWI1NWUyN2RjMTdkNDVjNDViM2Q3NGQ5ZjMzZDg2OCIsInN1YiI6IjY1MmQ5MjE0MGNiMzM1MTZmODg0NzFlMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2NNwlH4pu5jdkXeyvHRgmo4dJPW_vwvTB-a_BlLTyls",
};

const fmt = (n) => {
  if (!n || n === 0) return null;
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
};

const statusColor = (s) => {
  if (s === "Released") return { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.35)", text: "#4ade80" };
  if (s === "In Production") return { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.35)", text: "#fbbf24" };
  return { bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.3)", text: "#94a3b8" };
};

const SectionTitle = ({ children }) => (
  <div className="mb-4">
    <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{children}</h2>
    <div className="h-0.5 w-12 mt-1 rounded-full bg-blue-500" />
  </div>
);

const StatChip = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
    style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }}>
    <span className="text-blue-400">{icon}</span>
    <span style={{ color: "var(--text-muted)" }}>{label}</span>
    <span className="font-semibold" style={{ color: "var(--text)" }}>{value}</span>
  </div>
);

const SimilarCard = ({ movie }) => (
  <div className="relative rounded-xl overflow-hidden cursor-pointer"
    style={{ border: "1px solid var(--card-border)", transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease" }}
    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(59,130,246,0.2)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.boxShadow = "none"; }}
  >
    <Link to={`/movie/${movie.id}`}>
      <img className="w-full h-64 object-cover"
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
        style={{ background: "var(--overlay-b)", border: "1px solid rgba(59,130,246,0.4)" }}>
        <AiFillStar className="text-yellow-400 text-xs" />
        {movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : "N/A"}
      </div>
    </Link>
    <div className="p-3" style={{ background: "var(--card)" }}>
      <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{movie.title}</p>
      <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{movie.release_date}</p>
    </div>
  </div>
);

const MovieCard = () => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [videoKey, setVideoKey] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAll = async () => {
      window.scrollTo(0, 0);
      setMovieDetails(null);
      setCredits(null);
      setVideoKey(null);
      try {
        const [detailRes, videoRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, { headers: API_HEADERS }),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, { headers: API_HEADERS }),
          fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, { headers: API_HEADERS }),
        ]);
        if (detailRes.ok) setMovieDetails(await detailRes.json());
        if (videoRes.ok) {
          const vd = await videoRes.json();
          const trailer = vd.results?.find((v) => v.type === "Trailer") || vd.results?.[0];
          if (trailer) setVideoKey(trailer.key);
        }
        if (creditsRes.ok) setCredits(await creditsRes.json());
      } catch (e) { console.error(e); }
    };
    fetchAll();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${page}`,
          { headers: API_HEADERS }
        );
        if (res.ok) {
          const data = await res.json();
          setRecommended(data.results);
          setTotalPages(data.total_pages);
        }
      } catch (e) { console.error(e); }
    };
    fetchSimilar();
    // eslint-disable-next-line
  }, [id, page]);

  const director = credits?.crew?.find((c) => c.job === "Director");
  const writers = credits?.crew?.filter((c) => c.job === "Screenplay" || c.job === "Writer").slice(0, 2);
  const cast = credits?.cast?.slice(0, 8);
  const sc = movieDetails ? statusColor(movieDetails.status) : {};

  if (!movieDetails) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ background: "var(--bg)" }}>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Backdrop Hero */}
      <div className="relative h-[50vh] md:h-[65vh]">
        <img className="w-full h-full object-cover"
          src={`https://image.tmdb.org/t/p/original/${movieDetails.backdrop_path}`}
          alt={movieDetails.title} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, var(--overlay-l) 40%, var(--overlay-r))" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--overlay-b) 0%, transparent 50%)" }} />
      </div>

      <div className="px-6 md:px-12 -mt-40 relative z-10">
        {/* Poster + Info */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img className="w-48 md:w-56 rounded-2xl object-cover"
              style={{ border: "2px solid rgba(59,130,246,0.3)", boxShadow: "0 0 30px rgba(59,130,246,0.2)" }}
              src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
              alt={movieDetails.title} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 pt-4 md:pt-24">
            {/* Title + tagline */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-glow" style={{ color: "var(--text)" }}>
                {movieDetails.title}
              </h1>
              {movieDetails.tagline && (
                <p className="mt-1 text-sm italic" style={{ color: "var(--text-muted)" }}>
                  "{movieDetails.tagline}"
                </p>
              )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                <AiFillStar />
                {Math.round(movieDetails.vote_average * 10) / 10}
                <span className="text-xs font-normal" style={{ color: "var(--text-faint)" }}>
                  ({movieDetails.vote_count?.toLocaleString()} votes)
                </span>
              </span>
              {movieDetails.release_date && (
                <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <FiCalendar /> {movieDetails.release_date}
                </span>
              )}
              {movieDetails.runtime > 0 && (
                <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <FiClock /> {Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m
                </span>
              )}
              {movieDetails.original_language && (
                <span className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa" }}>
                  {movieDetails.original_language}
                </span>
              )}
              {movieDetails.status && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
                  {movieDetails.status}
                </span>
              )}
            </div>

            {/* Genre chips */}
            {movieDetails.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movieDetails.genres.map((g) => (
                  <span key={g.id} className="px-3 py-1 rounded-full text-xs font-medium text-blue-400"
                    style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)" }}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--text-muted)" }}>
              {movieDetails.overview}
            </p>

            {/* Director / Writer */}
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
              {director && (
                <span>
                  <span className="font-medium" style={{ color: "var(--text)" }}>Director: </span>
                  {director.name}
                </span>
              )}
              {writers?.length > 0 && (
                <span>
                  <span className="font-medium" style={{ color: "var(--text)" }}>Writer: </span>
                  {writers.map((w) => w.name).join(", ")}
                </span>
              )}
            </div>

            {/* Budget / Revenue */}
            <div className="flex flex-wrap gap-2">
              {fmt(movieDetails.budget) && (
                <StatChip icon={<MdAttachMoney />} label="Budget" value={fmt(movieDetails.budget)} />
              )}
              {fmt(movieDetails.revenue) && (
                <StatChip icon={<MdTrendingUp />} label="Revenue" value={fmt(movieDetails.revenue)} />
              )}
              {movieDetails.belongs_to_collection && (
                <StatChip icon={<MdMovieFilter />} label="Collection" value={movieDetails.belongs_to_collection.name} />
              )}
            </div>

            {/* Countries + Languages */}
            <div className="flex flex-col gap-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {movieDetails.production_countries?.length > 0 && (
                <span>
                  <span className="font-medium" style={{ color: "var(--text)" }}>Countries: </span>
                  {movieDetails.production_countries.map((c) => c.name).join(", ")}
                </span>
              )}
              {movieDetails.spoken_languages?.length > 0 && (
                <span>
                  <span className="font-medium" style={{ color: "var(--text)" }}>Languages: </span>
                  {movieDetails.spoken_languages.map((l) => l.english_name).join(", ")}
                </span>
              )}
              {movieDetails.production_companies?.length > 0 && (
                <span>
                  <span className="font-medium" style={{ color: "var(--text)" }}>Production: </span>
                  {movieDetails.production_companies.map((c) => c.name).join(", ")}
                </span>
              )}
            </div>

            {/* Watch CTA */}
            <Link
              target="_blank"
              to={`https://www.themoviedb.org/movie/${id}-${movieDetails.title}/watch?locale=US`}
              className="flex items-center gap-2 w-fit px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", boxShadow: "0 0 20px rgba(59,130,246,0.4)" }}
            >
              <FiPlay /> Watch Now
            </Link>
          </div>
        </div>

        {/* Cast */}
        {cast?.length > 0 && (
          <div className="mt-12">
            <SectionTitle>Cast</SectionTitle>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {cast.map((actor) => (
                <div key={actor.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2"
                    style={{ border: "2px solid var(--card-border)" }}>
                    {actor.profile_path ? (
                      <img className="w-full h-full object-cover"
                        src={`https://image.tmdb.org/t/p/w185/${actor.profile_path}`}
                        alt={actor.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: "var(--input-bg)" }}>
                        <FiUser className="text-2xl" style={{ color: "var(--text-faint)" }} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-tight" style={{ color: "var(--text)" }}>{actor.name}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-faint)" }}>{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trailer */}
        {videoKey && (
          <div className="mt-12">
            <SectionTitle>Trailer</SectionTitle>
            <iframe
              className="w-full md:w-[720px] h-[220px] md:h-[405px] rounded-2xl"
              style={{ border: "1px solid rgba(59,130,246,0.2)", boxShadow: "0 0 30px rgba(59,130,246,0.15)" }}
              title="trailer"
              src={`https://www.youtube.com/embed/${videoKey}`}
              allowFullScreen
            />
          </div>
        )}

        {/* Similar Movies */}
        {recommended.length > 0 && (
          <div className="mt-14 pb-12">
            <div className="flex justify-between items-center mb-4">
              <SectionTitle>You May Also Like</SectionTitle>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommended.filter((m) => m.poster_path).map((movie) => (
                <SimilarCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
