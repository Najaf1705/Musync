import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../redux/features/auth/authSlice';
import { clearSongSliceThunk } from '../../redux/features/song/songThunks';
import { toast } from 'react-toastify';
import { AiFillGithub } from "react-icons/ai";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { showErrorToast, showSuccessToast } from '../utils/toast';
import { logoutUser } from '../../redux/features/auth/authThunks';


const defaultProfilePicture = process.env.PUBLIC_URL + '/images/pp.png';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.isAuthenticated ? state.auth.user : null);

  // useEffect(() => {
  //   if (userDetails && userDetails.image) {
  //     console.log("img", userDetails.image)
  //     setProfilePictureURL(userDetails.image);
  //   } else {
  //     setProfilePictureURL(defaultProfilePicture);
  //   }
  // }, [userDetails]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      showSuccessToast("Logged out Successfully");
    } catch (error) {
      console.error('Logout error:', error);
      showErrorToast("Logout failed. Please try again.");
    }
  };

  const navItems = [
    { path: "", label: "Home" },
    ...(user ? [{ path: "/playlists", label: "Playlists" }] : []),
    {path: "/discover", label: "Discover"},
    {path: "/download", label: "Download"},
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-lg backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        {/* Logo and Profile Section */}
        <div className="flex items-center">
          {user && (
            <NavLink to="/profile">
              <img
                className="rounded-full w-8 h-8 mr-4 border-2 border-gray-700 object-cover hover:ring-2 hover:ring-blue-400 transition"
                src={user.image || defaultProfilePicture}
                // onError={() => setProfilePictureURL(defaultProfilePicture)}
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
          <AiFillGithub
            size={28}
            className="cursor-pointer text-white hover:text-gray-600 ml-4 transition"
            onClick={() => window.open("https://github.com/Najaf1705/Musync", "_blank")}
            aria-label="Visit GitHub repository"
            title="Visit GitHub repository"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex space-x-6">
          {navItems.map(({ path, label }) => (
            <NavLink
              key={path}
              className={({ isActive }) =>
                `text-white hover:text-gray-300 transition ${isActive ? 'font-semibold' : ''}`
              }
              to={path}
              end={path === ""}
            >
              {label}
            </NavLink>
          ))}
          {user ? (
            <button
              className="text-red-500 hover:text-red-400 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                className="text-white hover:text-gray-300 transition"
                to="/login"
              >
                Login
              </NavLink>
              <NavLink
                className="text-white hover:text-gray-300 transition"
                to="/signup"
              >
                Signup
              </NavLink>
            </>
          )}
        </div>

        {/* Dropdown Menu */}
        <Dropdown>
          <DropdownTrigger>
            <Button className="lg:hidden text-white text-2xl">
              <i className="fa-solid fa-bars"></i> {/* Hamburger Icon */}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Navigation Menu" className="bg-gray-800 rounded-md text-white px-6">
            {navItems.map(({ path, label }) => (
              <DropdownItem key={path} className="py-2">
                <NavLink
                  className="w-full text-white hover:text-gray-300"
                  to={path}
                  end={path === ""}
                >
                  {label}
                </NavLink>
              </DropdownItem>
            ))}
            {user ? (
              <DropdownItem key="logout" className="py-2 text-danger" onClick={handleLogout}>
                Logout
              </DropdownItem>
            ) : (
              <>
                <DropdownItem key="login" className="py-2">
                  <NavLink className="w-full text-white hover:text-gray-300" to="/login">
                    Login
                  </NavLink>
                </DropdownItem>
                <DropdownItem key="signup" className="py-2">
                  <NavLink className="w-full text-white hover:text-gray-300" to="/signup">
                    Signup
                  </NavLink>
                </DropdownItem>
              </>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;