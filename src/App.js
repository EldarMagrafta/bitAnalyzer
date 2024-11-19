import React, {useState} from "react";
import Dashboard from "./pages/Dashboard";

function App() {
    const [dateRange, setDateRange] = useState([]);
    return <Dashboard setDateRange={setDateRange}/>;
}

export default App;
