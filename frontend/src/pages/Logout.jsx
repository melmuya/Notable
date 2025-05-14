import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  return null;
}

// This component handles the logout process by removing the token from local storage and redirecting to the login page.