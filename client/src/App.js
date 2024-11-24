import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/UI/MainMenu';
import Game from './components/Game/Game';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/play" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
