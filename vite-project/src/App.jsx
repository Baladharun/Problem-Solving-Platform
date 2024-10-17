import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './Mainpage.jsx';
import EvaluationPage from './EvaluationPage.jsx';
import LoginPage from './LoginPage.jsx';

function PrivateRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
  <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
  <Route 
    path="/" 
    element={
      <PrivateRoute isLoggedIn={isLoggedIn}>
        <MainPage />
      </PrivateRoute>
    } 
  />
  <Route 
    path="/evaluating" 
    element={
      <PrivateRoute isLoggedIn={isLoggedIn}>
        <EvaluationPage />
      </PrivateRoute>
    } 
  />
</Routes>

    </Router>
  );
}

export default App;
