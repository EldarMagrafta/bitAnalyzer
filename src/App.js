import React from 'react';
import CsvReader from './pages/CsvReader';
import Logo from './components/Logo';
import Transaction from './components/Transaction';
import './assets/styles/App.css';

const transactionData = {
  date: "30.06.24",
  amount: 50,
  person: "נבו"
};



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
      <h1>Transaction Details</h1>
      <Transaction transaction={transactionData} />
      <CsvReader/>
    </div>
  );
}

export default App;
