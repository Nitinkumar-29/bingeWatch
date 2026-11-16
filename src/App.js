import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import MovieList from "./Pages/MovieList";
import MovieCard from "./Components/MovieCard";
import Search from "./SearchMovies/Search";
import MovieState from "./Context/MovieState";
import { ThemeProvider } from "./Context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
    <MovieState>
      <Router>
        <Navbar />
        <Routes>
          <Route exact index element={<Home />} />
          <Route exact path="/movies/:type" element={<MovieList />} />
          <Route exact path="/movie/:id" element={<MovieCard />} />
          <Route exact path="/searchResults" element={<Search />} />
        </Routes>
      </Router>
    </MovieState>
    </ThemeProvider>
  );
}

export default App;
