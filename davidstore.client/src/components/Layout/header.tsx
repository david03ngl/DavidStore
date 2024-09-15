import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import SearchIcon from '@mui/icons-material/Search';
import CartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { FC } from 'react';
import './header.css';

interface HeaderProps {
    isAuthenticated: boolean;
}

const Header: FC<HeaderProps> = ({ isAuthenticated }) => {
    return (
        <header className='header'>
            <Link to='/' className='logo'>
                <img src={logo} height='40' alt='logo' />
            </Link>
            <nav className='nav-links'>
                <Link to='/home'>Home</Link>
                <Link to='/productCategories'>Product Category</Link>
                <Link to='/products'>Product</Link>
                <Link to='/transactions'>Transaction</Link>
            </nav>
            <div className='header-actions'>
                <Link to='/products/search'>
                    <SearchIcon />
                </Link>
                <Link to='/cart'>
                    <CartIcon />
                </Link>
                {isAuthenticated ? (
                    <Link to='/profile'>
                        <PersonOutlineOutlinedIcon />
                    </Link>
                ) : (
                    <Link to='/login'>
                        <button className='login-button' type='button'>Login</button>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;

