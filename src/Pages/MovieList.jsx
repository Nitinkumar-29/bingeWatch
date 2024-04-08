import React, {useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import loadingGif from "../images/loading.gif";

const MovieList = () => {
  const [movieList, setmovieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { type } = useParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);

  const movieListData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${
          type ? type : "popular"
        }?language=en-US&page=${page}`,
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
        setmovieList(data.results);
        setLoading(false);
        setTotalPages(data.total_pages);
      } else {
        console.log("network error");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    movieListData(page + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => prevPage - 1);
    movieListData(page - 1);
  };

  useEffect(() => {
    movieListData(1, type);
    setPage(1);
    // eslint-disable-next-line
  }, [type]);

  return (
    <>
      {!loading ? (
        <div className="my-10 mx-4 space-y-6">
          <div className="flex justify-between items-center">
            <span
              style={{ textTransform: "capitalize" }}
              className="text-2xl md:text-3xl font-semibold"
            >
              {type ? type : "popular"}
            </span>
            <div className="space-x-4 text-white">
              <button
                className={`shadow-sm shadow-black px-3 text-sm md:text-base py-1 rounded-lg ${
                  page > 1 ? "bg-sky-600" : "bg-sky-900"
                }`}
                onClick={handlePreviousPage}
                disabled={page <= 1}
                style={{ cursor: page > 1 ? "pointer" : "not-allowed" }}
              >
                Previous
              </button>
              <button
                className={`shadow-sm shadow-black px-3 text-sm md:text-base py-1 rounded-lg ${
                  page <= totalPages ? "bg-sky-600" : "bg-sky-900"
                }`}
                onClick={handleNextPage}
                disabled={page >= totalPages}
                style={{
                  cursor: page <= totalPages ? "pointer" : "not-allowed",
                }}
              >
                Next
              </button>
            </div>
          </div>
          <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {movieList.map((data) => {
              return (
                <>
                  <div>
                    <div className="md:hover:scale-105 duration-500 ease-in-out">
                      <Link
                        to={`/movie/${data.id}`}
                      >
                        <img
                          className="border-0 border-black shadow-sm shadow-black h-[30rem] mx-auto w-screen object-cover md:h-96 rounded-lg"
                          src={`https://image.tmdb.org/t/p/original/${data.poster_path}`}
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="my-3 flex flex-col">
                      <Link
                        to={`/movie/${data.id}-${data.title}`}
                        className="hover:underline duration-200"
                      >
                        {data.title
                          ? data.title.length > 30
                            ? `${data.title.slice(0, 30)}...`
                            : data.title
                          : ""}
                      </Link>
                      <div className="flex justify-between">
                        <span className="">{data.release_date}</span>
                        <span>
                          {data.vote_average
                            ? `${Math.round(data.vote_average * 10) / 10}`
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-fit my-12">
          <img src={loadingGif} alt="" />
        </div>
      )}
    </>
  );
};

export default MovieList;
