import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-icon">☕</span>
                        <span className="brand-text">BeanByte</span>
                    </Link>

                    <div className="navbar-menu">
                        <Link to="/" className="nav-link">Home</Link>

                        {user ? (
                            <>
                                <Link to="/orders" className="nav-link">My Orders</Link>
                                <Link to="/api-keys" className="nav-link">API Keys</Link>
                                <Link to="/api-docs" className="nav-link">API Docs</Link>

                                {user.role === 'admin' && (
                                    <Link to="/admin" className="nav-link admin-link">
                                        Admin Dashboard
                                    </Link>
                                )}

                                <div className="nav-user">
                                    <span className="user-name">{user.nama}</span>
                                    <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
