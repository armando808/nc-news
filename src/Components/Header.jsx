import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/LI-News-teal.png";

function Header({ isDarkMode, handleThemeToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleViewAllArticlesClick = () => {
    navigate("/articles?topic=all");
    closeMenu();
  };

  return (
    <header className="bg-[#108470] text-white shadow-lg sticky top-0 z-[500]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Logo" className="h-20 w-25" />
          </div>
          <div className="flex items-center space-x-4 relative">
            <button
              ref={buttonRef}
              className="flex items-center px-3 py-2 rounded-md transition duration-300 focus:outline-none text-white bg-[#108470]"
              onClick={toggleMenu}
            >
              <FontAwesomeIcon
                icon={menuOpen ? faTimes : faBars}
                className="text-white text-lg"
              />
            </button>

            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-0 w-48 bg-[#108470] rounded-md shadow-lg py-2 z-[600] text-left"
                style={{ top: "100%" }}
              >
                <Link
                  to="/"
                  className="block px-4 py-2 text-white rounded-md transition duration-300 bg-[#108470] hover:text-black hover:bg-white"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <button
                  onClick={handleViewAllArticlesClick}
                  className="block w-full text-left px-4 py-2 text-white rounded-md transition duration-300 bg-[#108470] hover:text-black hover:bg-white"
                >
                  View All Articles
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-white rounded-md transition duration-300 bg-[#108470] hover:text-black hover:bg-white"
                  onClick={() => {
                    handleThemeToggle();
                    closeMenu();
                  }}
                >
                  {isDarkMode ? (
                    <>
                      <FontAwesomeIcon icon={faSun} className="mr-2" /> Light
                      Mode
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faMoon} className="mr-2" /> Dark
                      Mode
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;