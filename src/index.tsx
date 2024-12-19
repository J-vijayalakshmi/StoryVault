import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Generes from './components/Generes';
import WritePage from './components/WritePage'; // Assuming you have this page

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* MainPage wraps LandingPage */}
        <Route path="/" element={<MainPage />} />
        {/* Route for Generes */}
        <Route path="/generes" element={<Generes />} />
        {/* Route for WritePage (if needed) */}
        <Route path="/writerpage" element={<WritePage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

