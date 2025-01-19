import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './Mainpage.jsx';
import EvaluationPage from './EvaluationPage.jsx';
import LoginPage from './LoginPage.jsx';
import ProblemSet from './ProblemSet.jsx';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token'); 
  return token ? children : <Navigate to="/login" />;
}

function App() {

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<LoginPage />} 
        />
        <Route 
          path="/question" 
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/evaluating" 
          element={
            <PrivateRoute>
              <EvaluationPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <ProblemSet />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
