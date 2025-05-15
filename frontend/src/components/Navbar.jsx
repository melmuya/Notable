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
      <h2 className="navbar-brand">Notable</h2>
      <div className="navbar-links">
        {/* <Link to="/dashboard" className="navbar-link">Dashboard</Link>
        <Link to="/notes" className="navbar-link">My Notes</Link> */}
        <button onClick={handleLogout} className="navbar-button">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
