import React from 'react';
// import {  } from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { toast } from 'react-toastify';
import profilePicture from '../images/doodle.jpg';

const Navbar = (props) => {
  
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // const { login } =props;
  useEffect(()=>{
    if(isLoggedIn){
      props.onLogStateChange(false);
      fetchProfilePicture(); 

      const checkCookieExpiration = setInterval(() => {
        const expirationDate = new Date(localStorage.getItem('cookieExpiration'));
        if (expirationDate < new Date()) {
          handleLogout();
          clearInterval(checkCookieExpiration); 
        }
      }, 1000*60*60*24);
    }else{
      props.onLogStateChange(true);
    }
  })

  const handleLogout = async () => {
    try {
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('cookieExpiration');
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        props.onLogStateChange(true); 
        toast.success("Logged out Successfully");
      } else {
        console.error('Logout failed with status: ' + response.status);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const response = await fetch('/serverprofile'); // Replace with your server route
      if (response.status === 200) {
        const data = await response.json();
        if (data.image) {
          setProfilePictureURL(data.image); 
        } else {
          setProfilePictureURL(profilePicture); 
        }
      } else {
        console.error('Failed to fetch profile picture:', response.status);
      }
    } catch (error) {
      console.error('Error while fetching profile picture:', error);
    }
  };
  

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-lg fixed-top">
        <div className="container-fluid">
          <NavLink
            className="navbar-brand mr-1"
            to="/"
            style={{ color: "white" }}
            >
            {isLoggedIn?(
              <NavLink to="/profile">
                <img
                  src={profilePictureURL}
                  alt=""
                  style={{ width: "2rem", height: "2rem", borderRadius: "50%", marginRight: "1rem" }}
                />
              </NavLink>
              ):("")}
            <i
              className="fa-solid fa-backward-step "
            ></i>{" "}
            Musync{" "}
            <i
              className="fa-solid fa-forward-step"
            ></i>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            style={{ backgroundColor: "grey" }}
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-0">
              <li className="nav-item px-2">
                <NavLink className="a active" aria-current="page" to="">
                  Home
                </NavLink>
              </li>
              <li className="nav-item px-2">
                <NavLink
                  className="a active"
                  aria-current="page"
                  to="/discover"
                >
                  Discover
                </NavLink>
              </li>
              <li className="nav-item px-2">
                <NavLink
                  className="a active"
                  aria-current="page"
                  to="/playlists"
                >
                  Playlists
                </NavLink>
              </li>
              <li className="nav-item px-2">
                <NavLink
                  className="a active"
                  aria-current="page"
                  to="/download"
                >
                  Download
                </NavLink>
              </li>
              {/* <li className="nav-item px-2">
                <NavLink className="a active" aria-current="page" to="/profile">
                  Profile
                </NavLink>
              </li> */}
              <li className="sinlog nav-item px-3">
                {props.login ? (
                  // Render "Logout" when user is authenticated
                  <>
                    <NavLink
                      className="a active"
                      onClick={handleLogout}
                      style={{ cursor: "pointer" }}
                    >
                      Logout
                    </NavLink>
                  </>
                ) : (
                  // Render "Login" and "Signup" when user is not authenticated
                  <>
                    <NavLink
                      className="a active"
                      aria-current="page"
                      to="/login"
                    >
                      Login
                    </NavLink>
                    <span className="a">/</span>
                    <NavLink
                      className="a active"
                      aria-current="page"
                      to="/signup"
                    >
                      Signup
                    </NavLink>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar
