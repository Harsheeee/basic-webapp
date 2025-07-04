import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try{
            if (password === passwordCheck){
                const response = await fetch("http://localhost:8000/register",{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, password}),
                });
                if (response.ok){
                    const data = await response.json();
                    localStorage.setItem("token", data.access_token);
                    localStorage.setItem("username", username);
                    navigate("/dashboard")
                }
                else if(response.status == 409){
                    alert("Username already exists")
                }else{
                    const error = await response.text()
                    alert(error)
                }
            }
            else{
                alert("Passwords don't match")
            }
        }catch (error){
            console.log(error)
        }
    };
    return(
        <div>
            <h1>TODO LIST</h1>
            <div className="container">
                <h2>Create account</h2>
                <form
                className="login-form"
                action="main.html"
                method="get"
                onSubmit={handleSubmit}
                >
                <p>Username</p>
                <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} value={username}/>
                <p>Enter password</p>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)} value={password}
                />
                <p>Re-enter password</p>
                <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Re-enter password"
                    onChange={(e) => setPasswordCheck(e.target.value)} value={passwordCheck}
                />
                <button type="submit" className="login-btn">
                    Register
                </button>
                <p id="error-message" style={{ color: "red", marginTop: 10 }} />
                </form>
                <p className="signup-text">
                Have an account?
                </p>
                <button className="signup-btn" onClick={()=> navigate("/")}>
                    Login
                </button>
            </div>
        </div>
    )
}  