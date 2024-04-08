import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import loadingGif from "../images/loading.gif"

const MovieCard = () => {
  const [movieDetails, setMovieDetails] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [videoKey, setVideoKey] = useState();
  const { id } = useParams();

  const updateData = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${
          id ? id : "385687"
        }?/language=en-US&page=1`,
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
        setMovieDetails(data);
      } else {
        console.log("network error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const similarMovieData = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${
          id ? id : "385687"
        }/similar?language=en-US&page=${page}`,
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
        setRecommended(data.results);
        setTotalPages(data.total_pages);
      } else {
        console.log("network error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextClick = () => {
    setPage((prevPage) => prevPage + 1);
    similarMovieData(page + 1);
  };

  const handlePreviousClick = () => {
    setPage((prevPage) => prevPage - 1);
    similarMovieData(page - 1);
  };

  const updateMovieVideo = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${
          id ? id : "385687"
        }/videos?language=en-US`,
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
        const videoData = await response.json();
        if (videoData.results && videoData.results.length > 0) {
          // Assuming you want to use the first video's key
          const videoKey = videoData.results[0].key;
          setVideoKey(videoKey);
        }
      } else {
        console.log("network error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    updateData();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [id, videoKey]);
  useEffect(() => {
    updateMovieVideo();
    // eslint-disable-next-line
  }, [id]);
  useEffect(() => {
    similarMovieData();
    // eslint-disable-next-line
  }, [page]);

  const handleCardClick = (clickedMovieId) => {
    const updatedRecommended = recommended.filter(
      (movie) => movie.id !== clickedMovieId
    );
    setRecommended(updatedRecommended);
  };

  return (
    <>
      {movieDetails && (
        <div>
          {movieDetails.title ? (
            <div className="flex flex-col xl:flex-row items-center justify-between w-[95%] mx-auto">
              <div className="flex flex-col sm:flex-row justify-center items-center space-x-4 space-y-6 md:space-y-0 w-fit my-10">
                <div className="mx-auto">
                  <img
                    key={movieDetails.id}
                    className="rounded-md h-[30rem] sm:h-96 object-cover shadow-sm shadow-black"
                    src={`https://image.tmdb.org/t/p/original/${
                      movieDetails && movieDetails.poster_path
                    }`}
                    alt=""
                  />
                </div>
                {/* movie details */}
                <div className="space-y-2 flex justify-center items-start flex-col border-0 border-black w-fit sm:w-[30rem] md:w-[40rem] lg:w-[45rem] xl:w-[36rem]">
                  <span className="font-semibold text-2xl">
                    {movieDetails && movieDetails.title}
                  </span>

                  <span>{movieDetails && movieDetails.overview}</span>

                  <div className="flex flex-col">
                    {movieDetails.release_date && (
                      <div>
                        <span className="text-lg font-semibold">
                          Released:{" "}
                        </span>{" "}
                        {movieDetails && movieDetails.release_date}
                      </div>
                    )}
                    {movieDetails.vote_average && (
                      <div>
                        <span className="text-lg font-semibold">Rating: </span>
                        {Math.round(movieDetails.vote_average * 10) / 10}
                      </div>
                    )}
                    {/* <span>{movieDetails && movieDetails.original_language}</span> */}
                    {movieDetails.runtime && (
                      <div>
                        <span className="text-lg font-semibold">
                          Duration:{" "}
                        </span>{" "}
                        {movieDetails && movieDetails.runtime}m
                      </div>
                    )}
                    {movieDetails.genres && (
                      <div>
                        <span className="text-lg font-semibold">Genre: </span>
                        {movieDetails && movieDetails.genres
                          ? movieDetails.genres.map((genre) => (
                              <span key={genre.id} className="mr-1">
                                {genre.name},
                              </span>
                            ))
                          : null}
                      </div>
                    )}
                    {movieDetails.production_countries && (
                      <div>
                       <span className="text-lg font-semibold">Countries: </span>
                        {movieDetails && movieDetails.production_countries
                          ? movieDetails.production_countries.map(
                              (countries) => (
                                <span key={countries.iso_3166_1}>
                                  {countries.name}, &nbsp;
                                </span>
                              )
                            )
                          : null}
                      </div>
                    )}
                    {movieDetails.production_companies && (
                      <div>
                        <span className="text-lg font-semibold">Production: </span>
                        {movieDetails && movieDetails.production_companies
                          ? movieDetails.production_companies.map(
                              (production) => (
                                <span key={production.id}>
                                  {production.name},{" "}
                                </span>
                              )
                            )
                          : null}
                      </div>
                    )}

                    {movieDetails && (
                      <Link
                        target="blank"
                        className={`my-1 text-white shadow-black shadow-sm px-3 py-1 w-fit rounded-lg ${
                          movieDetails ? "bg-sky-600" : "bg-sky-900"
                        }`}
                        to={`https://www.themoviedb.org/movie/${id}-${movieDetails.title}/watch?locale=US`}
                      >
                        Watch here
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              {/* movie related youtube video */}
              <div className="items-start space-y-3">
                <span className="font-semibold text-2xl">
                  A glimpse of movie
                </span>
                <iframe
                  className="rounded-lg shadow-sm shadow-black w-[330px] sm:w-[400px] md:w-[860px] xl:w-[490px] h-[230px] md:h-[415px] xl:h-[300px]"
                  title="movieVideo"
                  src={`https://www.youtube.com/embed/${
                    videoKey ? videoKey : ""
                  }`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : (
            <span className="flex justify-center h-[32rem] items-center">
              <img src={loadingGif} alt="" />
            </span>
          )}

          {recommended&&recommended.length>0&&<div className="space-y-6 mt-5 bg-gray-100 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                {recommended ? (
                  recommended.length > 0 ? (
                    <span className="text-xl xl:text-3xl font-semibold">
                      You may also like
                    </span>
                  ) : (
                    ""
                  )
                ) : (
                  <span><img src={loadingGif} alt="" /></span>
                )}
              </div>
              {recommended&&recommended.length>0?<div className="space-x-4 text-white">
                <button
                  className={`shadow-black shadow-sm text-sm md:text-base px-3 py-1 rounded-lg ${
                    page > 1 ? "bg-sky-600" : "bg-sky-900"
                  } `}
                  disabled={page <= 1}
                  onClick={handlePreviousClick}
                  style={{
                    cursor: page > 1 ? "pointer" : "not-allowed",
                  }}
                >
                  Previous
                </button>
                <button
                  className={`shadow-black shadow-sm text-sm md:text-base px-3 py-1 rounded-lg ${
                    page < totalPages ? "bg-sky-600" : "bg-sky-900"
                  }`}
                  disabled={page >= totalPages}
                  onClick={handleNextClick}
                  style={{
                    cursor: page < totalPages ? "pointer" : "not-allowed",
                  }}
                >
                  Next
                </button>
              </div>:""}
            </div>

            <div className="my-4 grid gap-4 grid-flow-row grid-col-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {recommended &&
                recommended.map((movie) => {
                  return (
                    <>
                      {movie.poster_path && (
                        <div>
                          <Link
                            key={movie.id}
                            className=""
                            to={`/movie/${movie.id}`}
                          >
                            <div
                              className="md:hover:scale-105 duration-500 ease-in-out"
                              onClick={() => handleCardClick(movie.id)}
                            >
                              <img
                                key={movie.id}
                                className={`border-0 border-black shadow-sm shadow-black h-[30rem] mx-auto w-screen object-cover md:h-96 rounded-lg`}
                                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                alt=""
                              />
                            </div>
                          </Link>
                          <div className="my-3 flex flex-col">
                            <Link
                              to={`/movie/${movie.id}`}
                              onClick={() => handleCardClick(movie.id)}
                              className="hover:underline duration-200"
                            >
                              {movie.title
                                ? movie.title.length > 30
                                  ? `${movie.title.slice(0, 30)}...`
                                  : movie.title
                                : ""}
                            </Link>
                            <div className="flex justify-between">
                              <span className="">{movie.release_date}</span>
                              <span>
                                {movie.vote_average
                                  ? `${
                                      Math.round(movie.vote_average * 10) / 10
                                    }`
                                  : 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })}
            </div>
          </div>}
        </div>
      )}
    </>
  );
};

export default MovieCard;
