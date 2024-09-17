import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7207/api/auth/login', {
                username,
                password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);

            const decodedToken = jwtDecode(token) as any;
            const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
             
            if (userRole === 'Admin') {
                navigate('/products');
                window.location.reload();
            } else if (userRole === "Customer") {
                navigate('/shops');
                window.location.reload();
            }
        } catch (err) {
            setError('Invalid login credentials');
        }
    };

    return (
        <div>
            <form className="form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Username</label>
                    <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="btn submit-btn" type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;
