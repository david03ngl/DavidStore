import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import CartIcon from '@mui/icons-material/ShoppingCart';
import { FC } from 'react';
import './header.css';
import { jwtDecode } from 'jwt-decode';

interface HeaderProps {
    isAuthenticated: boolean;
}

const Header: FC<HeaderProps> = () => {
    const [storedData, setStoredData] = useState<string | null>(null);

    let userRole: string | null = null;

    useEffect(() => {
        const data = localStorage.getItem('token');  
        if (data) {
            try {
                const decodedToken = jwtDecode(data) as any;
                userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                setStoredData(userRole);
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        } else {
            setStoredData(null);
        }
    }, []); 

    const logout = () => {
        localStorage.removeItem('token');
        userRole = null;
        localStorage.setItem('login', 'login');
        window.location.reload();
    }

    return (
        <header className='header'>
            <Link to='/' className='logo'>
                <img src={logo} height='40' alt='logo' />
            </Link>
            <nav className='nav-links'>
                {storedData === 'Admin' && (
                    <>
                        <Link to='/home'>Home</Link>
                        <Link to='/productCategories'>Product Category</Link>
                        <Link to='/products'>Product</Link>
                        <Link to='/transactions'>Transaction</Link>
                    </>
                )}
                {storedData === 'Customer' && (
                    <>
                        <Link to='/shops'>Shop</Link>
                    </>
                )}
            </nav>
            <div className='header-actions'>
                {storedData !== null ? (
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

