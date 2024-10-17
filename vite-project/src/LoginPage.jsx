import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({setIsLoggedIn}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = () => {
    if (username === 'user' && password === 'password') {
      setIsLoggedIn(true); 
      navigate('/'); 
    } else {
      alert('Invalid login credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="tab-container">

        <input type="radio" name="tab" id="tab1" className="tab tab--1" checked={isLogin} onChange={() => setIsLogin(true)} />
        <label className="tab_label" htmlFor="tab1">Log in</label>

        <input type="radio" name="tab" id="tab2" className="tab tab--2" checked={!isLogin} onChange={() => setIsLogin(false)} />
        <label className="tab_label" htmlFor="tab2">Sign Up</label>
        
        <div className="indicator"></div>
      </div>

      <div className="tab-content">
        <div>

       
        {isLogin ? (
          <>
            <div className="get">
              <label>Enter your id</label>
              <input type='email' value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="get">
              <label>Enter your Password</label>
              <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button onClick={handleLogin}>Log In</button>
          </>
        ) : (
          <>
            <div className="get">
              <label>Enter your Name</label>
              <input type='text' />
            </div>
            <div className="get">
              <label>Enter your id</label>
              <input type='email' />
            </div>
            <div className="get">
              <label>Enter your Password</label>
              <input type='password' />
            </div>
            <div className="get">
              <label>Confirm password</label>
              <input type='password' />
            </div>
          </>
        )}
         </div>
      </div>
    </div>
  );
}

export default LoginPage;
