import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import GameCanvas from '../components/Game/GameCanvas';
import MainMenu from '../components/UI/MainMenu';
import LevelEditor from '../components/Game/LevelEditor';
import Leaderboard from '../components/UI/Leaderboard';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/play" element={<GameCanvas />} />
      <Route path="/editor" element={<LevelEditor />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </RouterRoutes>
  );
};

export default Routes;
