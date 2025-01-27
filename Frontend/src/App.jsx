import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginUser from './components/user/Login-user';    // Changed name to LoginUser
import LoginDoctor from './components/doctor/Login-doctor'; // Changed name to LoginDoctor
import Welcome from './components/WelcomePage';
import UserDashboard from './components/user/user-dashboard'; // Import the UserDashboard component
import DoctorDashboard from './components/doctor/doctor-dashboard'; // Import the DoctorDashboard component
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />}/>
                <Route path="/user/login" element={<LoginUser />} />  {/* Use LoginUser */}
                <Route path="/user/dashboard" element={<UserDashboard />} /> {/* Add this new route */}
                <Route path="/doctor/login" element={<LoginDoctor />} /> {/* Use LoginDoctor */}
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} /> {/* Add this new route */}
            </Routes>
        </Router>
    );
};

export default App;
