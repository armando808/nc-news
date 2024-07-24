import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Header({ isDarkMode, handleThemeToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-customRed text-white shadow-custom-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold">NC News</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:border-white border-transparent border-2 text-white hover:text-white font-semibold text-lg px-3 py-2 rounded-md transition duration-300">Home</Link>
            <Link to="/articles" className="hover:border-white border-transparent border-2 text-white hover:text-white font-semibold text-lg px-3 py-2 rounded-md transition duration-300">View All Articles</Link>
            <div className="border-l-2 border-white h-6 mx-2"></div>
            <button 
              className="flex items-center border-2 border-transparent hover:border-white px-3 py-2 rounded-md transition duration-300 focus:outline-none"
              onClick={handleThemeToggle}
            >
              {isDarkMode ? (
                <>
                  <FontAwesomeIcon icon={faSun} className="mr-2" /> Light Mode
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMoon} className="mr-2" /> Dark Mode
                </>
              )}
            </button>
          </div>
          <div className="md:hidden">
            <button 
              className="flex items-center px-3 py-2 rounded-md transition duration-300 focus:outline-none"
              onClick={toggleMenu}
            >
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} className="text-white text-lg" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center space-y-4 mt-4">
            <Link to="/" className="hover:border-white border-transparent border-2 text-white hover:text-white font-semibold text-lg px-3 py-2 rounded-md transition duration-300">Home</Link>
            <Link to="/articles" className="hover:border-white border-transparent border-2 text-white hover:text-white font-semibold text-lg px-3 py-2 rounded-md transition duration-300">View All Articles</Link>
            <div className="border-t-2 border-white w-full"></div>
            <button 
              className="flex items-center border-2 border-transparent hover:border-white px-3 py-2 rounded-md transition duration-300 focus:outline-none"
              onClick={handleThemeToggle}
            >
              {isDarkMode ? (
                <>
                  <FontAwesomeIcon icon={faSun} className="mr-2" /> Light Mode
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMoon} className="mr-2" /> Dark Mode
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
