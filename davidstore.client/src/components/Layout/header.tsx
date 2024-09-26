import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import SearchIcon from '@mui/icons-material/Search';
import CartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { FC } from 'react';
import './header.css';
import { jwtDecode } from 'jwt-decode';

interface HeaderProps {
    isAuthenticated: boolean;
}

const Header: FC<HeaderProps> = () => {
    const token = localStorage.getItem('token');
    let userRole: string | null = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token) as any;
            userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        } catch (error) {
            console.error('Failed to decode token:', error);
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        userRole = null;
        window.location.reload();
    }

    return (
        <header className='header'>
            <Link to='/' className='logo'>
                <img src={logo} height='40' alt='logo' />
            </Link>
            <nav className='nav-links'>
                {userRole === 'Admin' && (
                    <>
                        <Link to='/home'>Home</Link>
                        <Link to='/productCategories'>Product Category</Link>
                        <Link to='/products'>Product</Link>
                        <Link to='/transactions'>Transaction</Link>
                    </>
                )}
                {userRole === 'Customer' && (
                    <>
                        <Link to='/shops'>Shop</Link>
                    </>
                )}
            </nav>
            <div className='header-actions'>
                {userRole !== null ? (
                    <>
                        <Link to='/cart'>
                            <CartIcon />
                        </Link>
                        <Link to='/'>
                            <button className='login-button' type='button' onClick={logout}>Logout</button>
                        </Link>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </header>
    );
};

export default Header;

