import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Menu = ({ isDarkMode, handleThemeToggle, handleViewAllArticlesClick, closeMenu }) => {
    return (
    <div
        className="absolute right-0 mt-0 w-48 bg-[#108470] rounded-md shadow-lg py-2 z-[600] text-left"
        style={{ top: '100%' }}
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
            <FontAwesomeIcon icon={faSun} className="mr-2" /> Light Mode
            </>
        ) : (
            <>
            <FontAwesomeIcon icon={faMoon} className="mr-2" /> Dark Mode
            </>
        )}
        </button>
    </div>
    );
};

export default Menu;