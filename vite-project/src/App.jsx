import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Mainpage.jsx';
import EvaluationPage from './EvaluationPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/evaluating" element={<EvaluationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
