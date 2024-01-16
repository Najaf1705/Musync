import React from 'react';
// import {  } from 'react';
import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { toast } from 'react-toastify';
const profilePicture = process.env.PUBLIC_URL + '/images/doodle.jpg';

const Navbar = (props) => {

  const navigate = useNavigate();  
  const [profilePictureURL, setProfilePictureURL] = useState(props.userDetails.image || profilePicture);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const navbarRef = useRef(null);

  const handleNavbarToggle = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false);
  };

  const handleDocumentClick = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      closeNavbar();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // to check if user has logged in in this device
  const getUserInfo = async () => {
  try {
    const response = await fetch('/serverprofile', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
        // Check if the response status is OK (status code 200)
        if (response.ok) {
          // Parse JSON data if the server returns JSON
          const data = await response.json();
          // Do something with the parsed data
          console.log('User info:', data);
          return data; // Return the parsed data
        } else {
          // If the server returns an error status, throw an error
          throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }
  } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  // const { login } =props;
  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        try {
          const user = await getUserInfo();
          // const user = await res.json();
          props.onLogStateChange(false, user);
          console.log("gg");
          fetchProfilePicture();  
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        props.onLogStateChange(true,null);
      }
    };
    fetchData();
  }, []);

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
        props.onLogStateChange(true,null);
        console.log("ggout");
        navigate('/');
        toast.success("Logged out Successfully");
      } else {
        console.error('Logout failed with status: ' + response.status);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // const fetchProfilePicture = async () => {
  //   try {
  //     const response = await fetch('/serverprofile'); // Replace with your server route
  //     if (response.status === 200) {
  //       const data = await response.json();
  //       if (data.image) {
  //         setProfilePictureURL(data.image); 
  //       } else {
  //         setProfilePictureURL(profilePicture); 
  //       }
  //     } else {
    //       console.error('Failed to fetch profile picture:', response.status);
    //     }
    //   } catch (error) {
      //     console.error('Error while fetching profile picture:', error);
      //   }
      // };
      
    const fetchProfilePicture=async()=>{
      if(props.userDetails.image){
        setProfilePictureURL(props.userDetails.image);
      }else{
        setProfilePictureURL(profilePicture); 
    }
  }
  

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-lg fixed-top">
        <div className="container-fluid" ref={navbarRef}>
          <div style={{display: "flex", alignItems: "center"}}>
            {isLoggedIn ? (
              <>
                <NavLink to="/profile">
                  <img
                    className="hover-container"
                    src={profilePictureURL}
                    alt=""
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      marginRight: "1rem",
                    }}
                  />
                </NavLink>
              </>
            ) : ("")}
            <NavLink
              className="navbar-brand mr-1"
              to="/"
              style={{ color: "white" }}
            >
              <i className="fa-solid fa-backward-step "></i> Musync{" "}
              <i className="fa-solid fa-forward-step"></i>
            </NavLink>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            style={{ backgroundColor: "grey" }}
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={handleNavbarToggle}
          >
          <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`} id="navbarSupportedContent">
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
              {props.login ? (
                <li className="nav-item px-2">
                  <NavLink
                    className="a active"
                    aria-current="page"
                    to="/playlists"
                  >
                    Playlists
                  </NavLink>
                </li>
                ) : (
                  ""
              )}
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
                {props.login?(
                  <NavLink className="a active" aria-current="page" to="/profile">
                    Profile
                  </NavLink>
                ):("")}
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
