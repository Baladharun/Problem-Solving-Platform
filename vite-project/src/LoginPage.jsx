import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios  from 'axios';
import './LoginPage.css';

function LoginPage({setIsLoggedIn}) {
  const [emailId,setEmailId] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const [isLogin, setIsLogin] = useState(true);
  const handleSignup = async()=>{
    try{
      const signup = await Axios.post('http://localhost:5174/signup',{
        emailId:emailId,
        password:password,
        username:username
      },{headers:{'Content-Type' :'application/json'}});
      if(signup.data == 'login-success');
      setIsLoggedIn(true);
      navigate('/');
    }
    catch(error){
      console.log(error);
    }
  }
  const handleLogin = async () => {
    try {
      const login = await Axios.post('http://localhost:5174/verify-login', { 
        emailId: emailId, 
        password: password 
      }, { 
        headers: { 'Content-Type': 'application/json' } 
      });
  
      if (login.data.success) {
        setIsLoggedIn(true); 
        navigate('/');
      } else {
        alert('Invalid login credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Server error');
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
              <input type='email' value={emailId} onChange={(e) => setEmailId(e.target.value)} />
            </div>
            <div className="get">
              <label>Enter your Password</label>
              <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button onClick={handleLogin} className='login-btn'>Log In</button>
          </>
        ) : (
          <>
            <div className="get">
              <label>Enter your Name</label>
              <input type='text' value={username} onChange={(e)=>{
                setUsername(e.target.value);
              }}/>
            </div>
            <div className="get">
              <label>Enter your id</label>
              <input type='email' value={emailId} onChange = {(e)=>{
                setEmailId(e.target.value);
              }}/>
            </div>
            <div className="get">
              <label>Enter your Password</label>
              <input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <div className="get">
              <label>Confirm password</label>
              <input type='password' value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}} />
            </div><button onClick={handleSignup} className='login-btn'>Sign Up</button>
          </>
        )}
         </div>
      </div>
    </div>
  );
}

export default LoginPage;
