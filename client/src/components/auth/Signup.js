import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthUtils } from './authUtils';

const Signup = () => {
  const { signupUser, googleSignupUser, isLoggedIn } = useAuthUtils();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/'); // Redirect to home or dashboard
    }
  }, [isLoggedIn, navigate]);

  function hide() {
    if (document.getElementById("confirmPassword").type === 'password') {
      document.getElementById("confirmPassword").type = "text";
      document.getElementById("hideeye1").style.display = "block";
      document.getElementById("hideeye2").style.display = "none";
    } else {
      document.getElementById("confirmPassword").type = "password";
      document.getElementById("hideeye1").style.display = "none";
      document.getElementById("hideeye2").style.display = "block";
    }
  }

  const [userData, setUserData] = useState({
    name: "", email: "", password: "", cpassword: ""
  });
  const [passwordMismatch, setPasswordMismatch] = useState(false);


  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    if (name === "password") {
      setPasswordMismatch(value !== userData.cpassword);
    }

    if (name === "cpassword") {
      setPasswordMismatch(userData.password !== value);
    }
  }

  return (
    <>
      <div className="msignup">
        <div className="container mt-3 d-flex flex-column align-items-center">
          {/* <h2>Registration Form</h2> */}
          <form onSubmit={(e) => {
            e.preventDefault();
            signupUser(userData)
          }} className="signup col-md-8">
            <div className="row">
              <h2>Registration</h2>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="firstName">
                  <i className="fa-solid fa-userData"></i> Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="Name"
                  required
                  autoComplete="off"
                  value={userData.name}
                  name="name"
                  onChange={handleInputs}
                />
              </div>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="email">
                  <i className="fa-solid fa-envelope"></i> Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  required
                  autoComplete="off"
                  value={userData.email}
                  name="email"
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="password">
                  <i className="fa-solid fa-lock"></i> Password
                </label>
                <div className="input-box">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    required
                    autoComplete="off"
                    value={userData.password}
                    name="password"
                    onChange={handleInputs}
                  />
                </div>
              </div>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="confirmPassword">
                  <i className="fa-solid fa-lock"></i> Confirm Password
                </label>
                <div className="input-box">
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    autoComplete="off"
                    value={userData.cpassword}
                    name="cpassword"
                    onChange={handleInputs}
                  />
                  <span className="eye" onClick={hide}>
                    <i id="hideeye1" className="fa-regular fa-eye"></i>
                    <i id="hideeye2" className="fa-regular fa-eye-slash"></i>
                  </span>
                </div>
              </div>
            </div>
            {passwordMismatch && (
              <div style={{ color: "black", paddingBottom: ".7rem" }}>
                Passwords do not match. Please try again.
              </div>
            )}
            <div id="wrongpassword"></div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="signbtn">
                Register
              </button>
              <NavLink to="/login" className="already">
                {" "}
                Already have an account?
              </NavLink>
            </div>
            <div className="line-container">
              <span className="text-between">or</span>
            </div>
            <div className="sociallog">
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const decoded = jwtDecode(credentialResponse.credential);
                    const googleEmail = decoded.email;
                    const name = decoded.name;
                    const image = decoded.picture;

                    googleSignupUser({ email: googleEmail, name, image });
                    console.log("decoded signup", decoded);
                  }}
                  onFailure={(error) => {
                    console.error(error);
                  }}
                >
                  <span>Sign in with Google</span>
                </GoogleLogin>
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup
