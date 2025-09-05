import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
// Create a Context for the user
const UserContext = createContext();

// Create a provider for the UserContext
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load the user from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser({
        id: decodedToken.id,
        employerId: decodedToken.employerId,
        applicantId: decodedToken.applicantId,
        employerName: decodedToken.employerName,
        applicantFirstname: decodedToken.applicantFirstname,
        applicantLastname: decodedToken.applicantLastname,
        userType: decodedToken.userType,
      });
    }
  }, []);

  // Update user state
  const loginUser = (userData) => {
    localStorage.setItem("token", userData.token);
    const decodedToken = jwtDecode(userData.token);
    setUser({
      id: decodedToken.id,
      employerId: decodedToken.employerId,
      applicantId: decodedToken.applicantId,
      employerName: decodedToken.employerName,
      applicantFirstname: decodedToken.applicantFirstname,
      applicantLastname: decodedToken.applicantLastname,
      userType: decodedToken.userType,
    });
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the UserContext
export const useUser = () => useContext(UserContext);
