import './styles/App.css';
// App.js
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Button from './components/Button';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <nav>
        <Button to="/">Home</Button>
        <Button to="/about">About</Button>
        <Button to="/contact">Contact</Button>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;

