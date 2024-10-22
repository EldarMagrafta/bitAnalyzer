// src/App.js
import React, { useState } from 'react';
import CsvReader from './pages/CsvReader';
import Logo from './components/Logo';
import './assets/styles/App.css';

function App() {
  const [dateRange, setDateRange] = useState('');

  return (
    <div className="app-container">
      <Logo />
      {dateRange && <h1>Transactions between {dateRange}</h1>}
      <CsvReader setDateRange={setDateRange} />
    </div>
  );
}

export default App;
