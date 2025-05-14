// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <h2>Notable</h2>
      <div style={styles.links}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/notes">My Notes</Link>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: '1rem',
    background: '#282c34',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  links: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  button: {
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
};

export default Navbar;
