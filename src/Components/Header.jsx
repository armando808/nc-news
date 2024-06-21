import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
    return (
        <header className='header'>
            <h1>NC News</h1>
            <div className='nav-buttons'>
                <Link to="/" className='nav-button'>Home</Link>
                <Link to="/articles" className='nav-button'>View All Articles</Link>
            </div>
        </header>
    )
}

export default Header
