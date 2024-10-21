import React from 'react';
import CsvReader from './CsvReader';
import FileInput from './FileInput';
import './App.css';
import Logo from './Logo';

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
