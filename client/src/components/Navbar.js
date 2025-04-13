import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserDetails } from '../redux/features/userSlice';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.css';

const defaultProfilePicture = process.env.PUBLIC_URL + '/images/doodle.jpg';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  
  const [profilePictureURL, setProfilePictureURL] = useState(defaultProfilePicture);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navbarRef = useRef(null);

  // Update profile picture when user details change
  useEffect(() => {
    if (userDetails?.image) {
      setProfilePictureURL(userDetails.image);
    }
  }, [userDetails]);

  // Handle navbar click outside
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavbarOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      dispatch(clearUserDetails());
      navigate('/');
      toast.success("Logged out Successfully");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const navItems = [
    { path: "", label: "Home" },
    { path: "/discover", label: "Discover" },
    { path: "/download", label: "Download" },
    ...(isLoggedIn ? [{ path: "/playlists", label: "Playlists" }] : [])
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-lg fixed-top">
      <div className="container-fluid" ref={navbarRef}>
        {/* Logo and Profile Section */}
        <div className="d-flex align-items-center">
          {isLoggedIn && (
            <NavLink to="/profile">
              <img
                className="hover-container rounded-circle"
                src={profilePictureURL}
                onError={() => setProfilePictureURL(defaultProfilePicture)}
                alt="Profile"
                style={{ width: "2rem", height: "2rem", marginRight: "1rem" }}
              />
            </NavLink>
          )}
          <NavLink className="navbar-brand mr-1" to="/" style={{ color: "white" }}>
            <i className="fa-solid fa-backward-step"></i> Musync{" "}
            <i className="fa-solid fa-forward-step"></i>
          </NavLink>
        </div>

        {/* Navbar Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          style={{ backgroundColor: "grey" }}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ml-0">
            {navItems.map(({ path, label }) => (
              <li key={path} className="nav-item px-2">
                <NavLink className="a active" to={path}>
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="sinlog nav-item px-3">
              {isLoggedIn ? (
                <NavLink className="a active" onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Logout
                </NavLink>
              ) : (
                <>
                  <NavLink className="a active" to="/login">Login</NavLink>
                  <span className="a">/</span>
                  <NavLink className="a active" to="/signup">Signup</NavLink>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;