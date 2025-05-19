import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">Notable</Link>
      <div className="navbar-links">
        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
        <Link to="/new-note" className="navbar-link">New Note</Link>
        <button onClick={handleLogout} className="navbar-button">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;