import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className='header'>
            <h1>NC News</h1>
            <Link to="/" className='home-button'>Home</Link>
        </header>
    )
}

export default Header