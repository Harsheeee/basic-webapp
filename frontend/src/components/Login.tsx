import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('username', username);
                navigate('/dashboard');
            } else {
                const text = await response.text()
                alert(text);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className="login-container">
            <h1>TODO LIST</h1>
            <div className="container">
                <h2>Login to your account</h2>
                <form className="login-form" action="main.html" method="get" onSubmit={handleSubmit}>
                <p>Username</p>
                <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} value={username} />
                <p>Password</p>
                <input type="password" placeholder="password" onChange={(e)=> setPassword(e.target.value)} value={password}/>
                <button type="submit" className="login-btn">
                    Login
                </button>
                </form>
                <p className="signup-text">
                Don't have an account?
                </p>
                <button className="signup-btn" onClick={() => navigate('/register')}>
                    Sign Up
                </button>
            </div>
        </div>

    );
}

export default Login;
