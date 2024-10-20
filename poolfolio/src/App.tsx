import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '././pages/HomePage';
import ProjectPage from '././pages/ProjectPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Define routes for each project */}
        <Route path="/project1" element={<ProjectPage title="Project 1" />} />
        <Route path="/project2" element={<ProjectPage title="Project 2" />} />
        <Route path="/project3" element={<ProjectPage title="Project 3" />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
