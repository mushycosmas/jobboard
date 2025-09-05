import React from 'react';

const Logout = ({ onLogout }) => {
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token from local storage
        if (onLogout) onLogout(); // Call the onLogout function to update the app state
        alert('You have logged out successfully.'); // Feedback to the user
        window.location.href = '/login'; // Redirect to the login page
    };

    return (
        <button onClick={handleLogout} style={{ display: 'none' }} className='text-white'>
            Logout
        </button>
    );
};

export default Logout;
