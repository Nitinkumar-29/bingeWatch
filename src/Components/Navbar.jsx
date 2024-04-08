import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MovieContext from "../Context/MovieContext";
import menu from "../images/menu.png";

const Navbar = () => {
  const location = useLocation();
  const { handleInputChange, handleSearch, query } = useContext(MovieContext);
  const [showMenu, setShowMenu] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const closeMenuOnResize = () => {
      if (window.innerWidth > 768) {
        setShowMenu(false);
      }
    };

    window.addEventListener("resize", closeMenuOnResize);
    // remove the event listener when component unmounts
    return () => {
      window.removeEventListener("resize", closeMenuOnResize);
    };
  });

  // Function to focus on the search input
  const focusSearchInput = () => {
    searchInputRef.current.focus();
  };

  // Event listener to trigger focus on "/" key press
  const handleKeyPress = (e) => {
    if (e.key === "/" || (e.ctrlKey && e.key === "k")) {
      e.preventDefault(); // Prevent the default behavior of the "/" key (e.g., adding it to the input field)
      focusSearchInput(); // Focus on the search input
    }
  };

  useEffect(() => {
    // Add an event listener to the document to listen for key presses
    document.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50 flex flex-col md:flex-row items-center w-full">
        <div className="shadow-sm shadow-black bg-sky-700 text-white w-full flex px-4 items-center h-16 justify-between">
          <div className="flex justify-between w-full md:w-fit">
            <Link to="/">
              <span onClick={()=>setShowMenu(false)} className="text-2xl">BingeWatch</span>
            </Link>
            {/* hamburger icon */}
            <span
              className="md:hidden w-fit cursor-pointer"
              onClick={toggleMenu}
            >
              <img
                className="invert hover:invert-0 duration-300 ease-in-out h-10 w-10"
                src={menu}
                alt=""
              />
            </span>
          </div>
          <div className="hidden md:flex space-x-5 text-lg">
            <Link
              className={`hover:text-black duration-300 ease-in-out ${
                location.pathname === "/movies/popular" ? "underline" : ""
              } underline-offset-[5px]`}
              to="/movies/popular"
            >
              Popular
            </Link>
            <Link
              className={`hover:text-black duration-300 ease-in-out ${
                location.pathname === "/movies/top_rated" ? "underline" : ""
              } underline-offset-[5px]`}
              to="/movies/top_rated"
            >
              Top rated
            </Link>
            <Link
              className={`hover:text-black duration-300 ease-in-out ${
                location.pathname === "/movies/upcoming" ? "underline" : ""
              } underline-offset-[5px]`}
              to="/movies/upcoming"
            >
              Upcoming
            </Link>
          </div>
          <div className="hidden md:flex items-center">
            <div className="space-x-4">
              <input
                className="text-black w-44 py-2 px-4 rounded-lg outline-none focus-within:placeholder:text-sky-700"
                type="text"
                id="search"
                placeholder="Type here to search"
                onChange={handleInputChange}
                ref={searchInputRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                    if(!query.length<=0){
                      navigate("/searchResults");
                    }
                  }
                }}
              />
              <Link to="/searchResults">
                <button
                  onClick={handleSearch}
                  disabled={query.length <= 0}
                  className={`border-[1px] border-black py-2 px-4 rounded-lg shadow-sm shadow-black ${
                    query.length > 0 ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  Search
                </button>
              </Link>
            </div>
          </div>
          {/* mobile-nav-part */}
          <div className="md:hidden"></div>
        </div>
        {/* mobile-menu */}
        {showMenu && (
          <div
            className={`absolute top-16 bg-opacity-90  bg-sky-700 text-white p-4 space-y-2 w-full flex flex-col`}
          >
            <Link
              onClick={toggleMenu}
              className={`w-fit hover:text-black duration-300 ease-in-out ${
                location.pathname === "/movies/popular" ? "underline" : ""
              } underline-offset-[5px]`}
              to="/movies/popular"
            >
              Popular
            </Link>
            <Link
              onClick={toggleMenu}
              className={`w-fit hover:text-black duration-300 ease-in-out ${
                location.pathname === "/movies/top_rated" ? "underline" : ""
              } underline-offset-[5px]`}
              to="/movies/top_rated"
            >
              Top rated
            </Link>
            <Link
              onClick={toggleMenu}
              className={`w-fit hover:text-black duration-300 ease-in-out ${
                location.pathname === "/movies/upcoming" ? "underline" : ""
              } underline-offset-[5px]`}
              to="/movies/upcoming"
            >
              Upcoming
            </Link>
            <div className="flex md:hidden items-center">
              <div className="space-x-4">
                <input
                  className="text-black w-44 py-2 px-4 rounded-lg outline-none focus-within:placeholder:text-sky-700"
                  type="text"
                  id="search"
                  placeholder="Type here to search"
                  onChange={handleInputChange}
                  ref={searchInputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                      toggleMenu()
                      if (!query.length <= 0) {
                        navigate("/searchResults");
                      }
                    }
                  }}
                />
                <Link to="/searchResults" onClick={toggleMenu}>
                  <button
                    onClick={handleSearch}
                    disabled={query.length <= 0}
                    className={`border-[1px] border-black py-2 px-4 rounded-lg shadow-sm shadow-black ${
                      query.length > 0 ? "cursor-pointer" : "cursor-not-allowed"
                    }`}

                  >
                    Search
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
