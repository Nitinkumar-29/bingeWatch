import React, { useContext, useEffect, useState } from "react";
import MovieContext from "../Context/MovieContext";
import { Link } from "react-router-dom";
import loadingGif from "../images/loading.gif";

const Search = () => {
  const { searchResults, loading, query } = useContext(MovieContext);

  // Function to save search results to local storage
  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Function to retrieve search results from local storage
  const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  useEffect(() => {
    if (!loading && searchResults.length > 0) {
      // Save the latest search results to local storage
      saveToLocalStorage("searchResults", searchResults);
    }
  }, [searchResults, loading]);

  // Determine whether to display search results or "No data found" message
  const displayResults = loading ? (
    <span className="">
      <img src={loadingGif} alt="" />
    </span>
  ) : searchResults.length > 0 ? (
    searchResults
  ) : (
    "Oops, no data found!"
  );

  return (
    <>
      <div className="flex flex-col items-start m-5">
        <span className="font-semibold text-lg">Results related to search</span>
        <div className="my-4 grid gap-6 grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.isArray(displayResults) ? (
            displayResults.map((movie) => (
              <div className="space-y-3 w-fit mx-auto" key={movie.id}>
                {/* {movie.poster_path&&<div className="mx-auto w-fit"> */}
                <Link className="w-fit" to={`/movie/${movie.id}`}>
                  <div className="hover:scale-105 duration-500 ease-in-out ">
                    <img
                      className={`object-cover border-0 border-black shadow-sm shadow-black h-[30rem] md:h-96 rounded-lg`}
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                          : "https://image.tmdb.org/t/p/original/1wOu8rdvPxU1ObHi20VcRhfNpbo.jpg"
                      }
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
                {/* </div>} */}
              </div>
            ))
          ) : (
            <div className="text-lg">{displayResults}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
