// src/App.js
import React, { useState } from 'react';
import CsvReader from './pages/CsvReader';
import Logo from './components/Logo';
import Footer from './components/Footer';
import './assets/styles/App.css';

function App() {
    const [dateRange, setDateRange] = useState([]);
    const [date1, date2] = dateRange;

    return (
        <div className="app-container">
            {/* Logo Container */}
            <div className="logo-container">
                <Logo />
                {date1 && date2 && <h1>פעילות בין {date1} ל-{date2}</h1>}
            </div>

            {/* Main Content */}
            <div className="content">
                <CsvReader setDateRange={setDateRange} />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default App;
