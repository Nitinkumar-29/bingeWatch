import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "../Components/Pagination";
import { AiFillStar } from "react-icons/ai";

const MovieCard = ({ data }) => (
  <div className="group relative rounded-xl overflow-hidden cursor-pointer"
    style={{ border: "1px solid var(--card-border)", transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease" }}
    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(59,130,246,0.2)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.boxShadow = "none"; }}
  >
    <Link to={`/movie/${data.id}`}>
      <img
        className="w-full h-72 object-cover"
        src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
        alt={data.title}
      />
      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
        style={{ background: "var(--overlay-b)", border: "1px solid rgba(59,130,246,0.4)" }}>
        <AiFillStar className="text-yellow-400 text-xs" />
        {data.vote_average ? Math.round(data.vote_average * 10) / 10 : "N/A"}
      </div>
    </Link>
    <div className="p-3" style={{ background: "var(--card)" }}>
      <Link to={`/movie/${data.id}`}
        className="text-sm font-medium hover:text-blue-500 transition-colors duration-200"
        style={{ color: "var(--text)" }}>
        {data.title?.length > 28 ? `${data.title.slice(0, 28)}...` : data.title}
      </Link>
      <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{data.release_date}</p>
    </div>
  </div>
);

const MovieList = () => {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { type } = useParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const movieListData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${type || "popular"}?language=en-US&page=${page}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZWI1NWUyN2RjMTdkNDVjNDViM2Q3NGQ5ZjMzZDg2OCIsInN1YiI6IjY1MmQ5MjE0MGNiMzM1MTZmODg0NzFlMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2NNwlH4pu5jdkXeyvHRgmo4dJPW_vwvTB-a_BlLTyls",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMovieList(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    movieListData();
    // eslint-disable-next-line
  }, [page, type]);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line
  }, [type]);

  const label = type ? type.replace("_", " ") : "popular";

  return (
    <div className="px-6 py-10" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold capitalize" style={{ color: "var(--text)" }}>{label}</h2>
          <div className="h-0.5 w-16 mt-1 rounded-full bg-blue-500" />
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movieList.map((data) => <MovieCard key={data.id} data={data} />)}
        </div>
      )}
    </div>
  );
};

export default MovieList;
