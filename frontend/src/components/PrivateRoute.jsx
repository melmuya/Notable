import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
// This component checks if a token exists in local storage. If it does, it renders the children components; otherwise, it redirects to the login page.
// This is useful for protecting routes that require authentication, ensuring that only logged-in users can access certain parts of the application.