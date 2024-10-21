import React from 'react';
import CsvReader from './pages/CsvReader';
import Logo from './components/Logo';
import './assets/styles/App.css';

function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Logo/>
      <CsvReader/>
    </div>
  );
}

export default App;
