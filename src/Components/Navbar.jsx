import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MovieContext from "../Context/MovieContext";
import { useTheme } from "../Context/ThemeContext";
import { FiSearch, FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { MdLocalMovies } from "react-icons/md";

const Navbar = () => {
  const location = useLocation();
  const { handleInputChange, handleSearch, query } = useContext(MovieContext);
  const { theme, toggle } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeMenuOnResize = () => {
      if (window.innerWidth > 768) setShowMenu(false);
    };
    window.addEventListener("resize", closeMenuOnResize);
    return () => window.removeEventListener("resize", closeMenuOnResize);
  });

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "/" || (e.ctrlKey && e.key === "k")) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const navLinks = [
    { label: "Popular", path: "/movies/popular" },
    { label: "Top Rated", path: "/movies/top_rated" },
    { label: "Upcoming", path: "/movies/upcoming" },
  ];

  const navStyle = {
    background: scrolled ? "var(--nav-scrolled)" : "var(--nav-glass)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    borderBottom: "1px solid var(--nav-border)",
    boxShadow: scrolled ? "0 4px 24px rgba(59,130,246,0.08)" : "none",
    transition: "background 0.3s ease, box-shadow 0.3s ease",
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="w-full flex items-center justify-between px-6 h-16" style={navStyle}>

        {/* Logo */}
        <Link to="/" onClick={() => setShowMenu(false)}>
          <div className="flex items-center gap-2">
            <MdLocalMovies className="text-blue-500 text-2xl" />
            <span className="text-xl font-bold tracking-wide text-glow" style={{ color: "var(--text)" }}>
              BingeWatch
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium transition-all duration-200 hover:text-blue-500"
              style={{
                color: location.pathname === link.path ? "#3b82f6" : "var(--text-muted)",
                borderBottom: location.pathname === link.path ? "2px solid #3b82f6" : "none",
                paddingBottom: location.pathname === link.path ? "2px" : "0",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Search + Toggle */}
        <div className="hidden md:flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }}
          >
            <FiSearch className="text-blue-500 text-sm" />
            <input
              ref={searchInputRef}
              className="bg-transparent text-sm outline-none w-44"
              style={{ color: "var(--text)" }}
              type="text"
              placeholder="Search movies..."
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.length > 0) {
                  handleSearch();
                  navigate("/searchResults");
                }
              }}
            />
            <span className="text-xs border rounded px-1" style={{ color: "var(--text-faint)", borderColor: "var(--text-faint)" }}>/</span>
          </div>
          <Link to="/searchResults">
            <button
              onClick={handleSearch}
              disabled={query.length <= 0}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                query.length > 0
                  ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              style={query.length <= 0 ? { background: "var(--input-bg)", color: "var(--text-faint)" } : {}}
            >
              Search
            </button>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-blue-500 hover:text-white"
            style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)", color: "var(--text-muted)" }}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
          </button>
        </div>

        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
            style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)", color: "var(--text-muted)" }}
          >
            {theme === "dark" ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
          </button>
          <button
            className="text-2xl transition-colors duration-200"
            style={{ color: "var(--text)" }}
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div
          className="md:hidden flex flex-col gap-4 px-6 py-5"
          style={{
            background: "var(--nav-scrolled)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderBottom: "1px solid var(--nav-border)",
            boxShadow: "0 8px 24px rgba(59,130,246,0.08)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setShowMenu(false)}
              className="text-sm font-medium transition-colors duration-200 hover:text-blue-500"
              style={{ color: location.pathname === link.path ? "#3b82f6" : "var(--text-muted)" }}
            >
              {link.label}
            </Link>
          ))}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }}
          >
            <FiSearch className="text-blue-500 text-sm" />
            <input
              className="bg-transparent text-sm outline-none flex-1"
              style={{ color: "var(--text)" }}
              type="text"
              placeholder="Search movies..."
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.length > 0) {
                  handleSearch();
                  setShowMenu(false);
                  navigate("/searchResults");
                }
              }}
            />
          </div>
          <Link to="/searchResults" onClick={() => setShowMenu(false)}>
            <button
              onClick={handleSearch}
              disabled={query.length <= 0}
              className={`w-full py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                query.length > 0 ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer" : "cursor-not-allowed"
              }`}
              style={query.length <= 0 ? { background: "var(--input-bg)", color: "var(--text-faint)" } : {}}
            >
              Search
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
