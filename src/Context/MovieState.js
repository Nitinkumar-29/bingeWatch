import React, { useState } from 'react'
import MovieContext from './MovieContext'

const MovieState = (props) => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState([]);

    const homePageMovieData = async () => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
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
                setPopularMovies(data.results);
                setTotalPages(data.total_pages);
            }
            else {
                console.log("Network error");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US`,
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
                setSearchResults(data.results);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleInputChange = (event) => {
        const newQuery = event.target.value;
        setQuery(newQuery);
    };


    return (
        <MovieContext.Provider value={{ homePageMovieData, page, setPage, popularMovies, totalPages, handleSearch, query, setQuery, handleInputChange, loading, searchResults }}>
            {props.children}
        </MovieContext.Provider>
    )
}

export default MovieState
