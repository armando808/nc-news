import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import logo from '../assets/LI-News-teal.png'
import { useClickOutside } from '../hooks/useClickOutside'
import Menu from './Menu'
import { useNavigate } from 'react-router-dom'

function Header({ isDarkMode, handleThemeToggle }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const navigate = useNavigate()

  useClickOutside(menuRef, () => setMenuOpen(false))

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  };

  const closeMenu = () => {
    setMenuOpen(false)
  };

  const handleViewAllArticlesClick = () => {
    navigate('/articles?topic=all')
    closeMenu()
  }

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
              <Menu
                isDarkMode={isDarkMode}
                handleThemeToggle={handleThemeToggle}
                handleViewAllArticlesClick={handleViewAllArticlesClick}
                closeMenu={closeMenu}
                ref={menuRef}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header