import React from 'react';
import CsvReader from './pages/CsvReader';
import Logo from './components/Logo';
import './assets/styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Logo />
      <h1>Transaction Details</h1>
      <CsvReader />
    </div>
  );
}

export default App;
