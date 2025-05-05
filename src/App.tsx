import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  return <AppRoutes />;
};

export default App;