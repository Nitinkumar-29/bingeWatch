import React, { useContext, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import loadingGif from "../images/loading.gif";
import MovieContext from "../Context/MovieContext";

const Home = () => {
  const context = useContext(MovieContext);
  const { page, setPage, homePageMovieData, popularMovies, totalPages } =
    context;

  const handleNextClick = () => {
    setPage((prevPage) => prevPage + 1);
    homePageMovieData(page + 1);
  };

  const handlePreviousClick = () => {
    setPage((prevPage) => prevPage - 1);
    homePageMovieData(page - 1);
  };

  useEffect(() => {
    homePageMovieData();
    // eslint-disable-next-line
  }, [page]);

  return (
    <>
      <div className="w-fit mx-auto">
        <Carousel
          showThumbs={false}
          autoPlay={true}
          transitionTime={5}
          infiniteLoop={true}
          showStatus={false}
          useKeyboardArrows={true}
        >
          {popularMovies?.map((movie, key) => {
            return (
              <>
                <Link key={movie.id} to={`/movie/${movie.id}`}>
                  <div className=" relative h-full md:h-fit lg:h-[80vh] mx-auto">
                    <img
                      className="w-full h-96 lg:h-fit object-cover"
                      src={`https://image.tmdb.org/t/p/original/${
                        movie && movie.backdrop_path
                      }`}
                      alt=""
                    />
                  </div>
                  <div className="w-[90%] absolute hidden lg:flex flex-col bottom-14 p-10 text-white bg-black mx-10 bg-opacity-20 rounded-lg">
                    <div className="flex flex-col items-start">
                      <span className="text-xl font-bold">
                        {movie && movie.title}
                      </span>
                      <div className="space-y-2">
                        <div className="space-x-6">
                          <span>{movie.release_date}</span>
                          <span>Vote({movie.vote_count})</span>
                        </div>
                      </div>
                      <div className="text-start">{movie.overview} </div>
                    </div>
                  </div>
                </Link>
              </>
            );
          })}
        </Carousel>

        <div className="my-10 mx-4 space-y-4">
          {popularMovies && popularMovies.length > 0 ? (
            <div className="flex justify-between mx-1">
              <span className="text-xl md:text-3xl font-semibold">
                Popular Movies
              </span>
              <div className="space-x-4 text-white">
                <button
                  className={`shadow-sm shadow-black rounded-lg text-xs md:text-base px-3 py-1 ${
                    page > 1 ? "bg-sky-700" : "bg-sky-900"
                  } ${page > 1 ? "cursor-pointer" : "cursor-not-allowed"}`}
                  disabled={page <= 1}
                  onClick={handlePreviousClick}
                >
                  Previous
                </button>
                <button
                  className={`shadow-sm shadow-black rounded-lg text-xs md:text-base px-3 py-1 ${
                    page <= totalPages ? "bg-sky-700" : "bg-sky-900"
                  } ${
                    page <= totalPages ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  disabled={page >= totalPages}
                  onClick={handleNextClick}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <span>
              <img src={loadingGif} alt="" />
            </span>
          )}
          <div className="my-4 grid gap-4 grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {popularMovies &&
              popularMovies.map((movie) => {
                return (
                  <>
                    <div className="space-y-3 w-fit mx-auto" key={movie.id}>
                      <Link className="w-fit" to={`/movie/${movie.id}`}>
                        <div className="md:hover:scale-105 duration-500 ease-in-out ">
                          <img
                            className={`border-0 border-black shadow-sm shadow-black h-[30rem] mx-auto w-screen object-cover md:h-96 rounded-lg`}
                            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                            alt=""
                          />
                        </div>
                      </Link>
                      <div className="my-3 flex flex-col">
                        <Link
                          to={`/movie/${movie.id}`}
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
                              ? `${Math.round(movie.vote_average * 10) / 10}`
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
      </div>
    </>
  );
};

export default Home;
