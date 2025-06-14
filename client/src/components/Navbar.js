import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/features/userSlice';
import { clearSongSlice } from '../redux/features/songSlice';
import { toast } from 'react-toastify';

const defaultProfilePicture = process.env.PUBLIC_URL + '/images/pp.png';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [profilePictureURL, setProfilePictureURL] = useState(userDetails?.image || defaultProfilePicture);

  useEffect(() => {
    if (userDetails && userDetails.image) {
      setProfilePictureURL(userDetails.image);
    } else {
      setProfilePictureURL(defaultProfilePicture);
    }
  }, [userDetails]);

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navbarRef = useRef(null);

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

      dispatch(clearUser());
      dispatch(clearSongSlice());
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
    <nav className="fixed top-0 left-0 w-full z-50 shadow-lg backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between py-2 px-4" ref={navbarRef}>
        {/* Logo and Profile Section */}
        <div className="flex items-center">
          {isLoggedIn && (
            <NavLink to="/profile">
              <img
                className="rounded-full w-8 h-8 mr-4 border-2 border-gray-700 object-cover hover:ring-2 hover:ring-blue-400 transition"
                src={profilePictureURL}
                onError={() => setProfilePictureURL(defaultProfilePicture)}
                alt="Profile"
              />
            </NavLink>
          )}
          <NavLink
            className="text-2xl font-bold flex items-center gap-2"
            style={{ textShadow: '-1px -1px 0 #f20, 1px -1px 0 #00ff37, -1px 1px 0 #ff00f2, 1px 1px 0 #1500ff' }}
            to="/"
          >
            <i className="fa-solid fa-backward-step"></i> Musync <i className="fa-solid fa-forward-step"></i>
          </NavLink>
        </div>

        {/* Navbar Toggle Button */}
        <button
          className="lg:hidden p-2 rounded bg-gray-700 text-white focus:outline-none"
          type="button"
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          aria-label="Toggle navigation"
        >
          <span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d={isNavbarOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </span>
        </button>

        {/* Navigation Items */}
        <div className={`flex-col lg:flex-row lg:flex items-center gap-2 lg:gap-4 absolute lg:static top-full left-0 w-full lg:w-auto bg-black bg-opacity-80 lg:bg-transparent transition-all duration-200 ease-in-out ${isNavbarOpen ? 'flex' : 'hidden'}`}>
          <ul className="flex flex-col lg:flex-row items-center w-full lg:w-auto">
            {navItems.map(({ path, label }) => (
              <li key={path} className="px-2 py-2 lg:py-0">
                <NavLink
                  className={({ isActive }) =>
                    `text-white hover:text-blue-400 px-2 py-1 rounded transition ${isActive ? 'font-semibold underline' : ''}`
                  }
                  to={path}
                  end={path === ""}
                  onClick={() => setIsNavbarOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="px-2 py-2 lg:py-0 flex items-center">
              {isLoggedIn ? (
                <button
                  className="text-white hover:text-red-400 px-2 py-1 rounded transition"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink className="text-white hover:text-blue-400 pl-2 py-1 rounded transition" to="/login" onClick={() => setIsNavbarOpen(false)}>Login</NavLink>
                  <span className="text-white">/</span>
                  <NavLink className="text-white hover:text-blue-400 pr-2 py-1 rounded transition" to="/signup" onClick={() => setIsNavbarOpen(false)}>Signup</NavLink>
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