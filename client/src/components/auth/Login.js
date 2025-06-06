import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useAuthUtils } from './authUtils'; // adjust path as needed

const Login = () => {
  const { loginUser, invalidCredentialsErr, googleLoginUser } = useAuthUtils(); // Import the loginUser function from authUtils
  const [userData, setUserData] = useState({
    name: "", email: ""
  });

  const hide = () => {
    if (document.getElementById("password").type === 'password') {
      document.getElementById("password").type = "text";
      document.getElementById("hideeye1").style.display = "block";
      document.getElementById("hideeye2").style.display = "none";
    } else {
      document.getElementById("password").type = "password";
      document.getElementById("hideeye1").style.display = "none";
      document.getElementById("hideeye2").style.display = "block";
    }
  }

  return (
    <>
      <div className="mlogin">
        <div className="container mt-3 d-flex flex-column align-items-center">
          <form onSubmit={(e) => {
            e.preventDefault();
            loginUser(userData);
          }} className='login col-md-5'>
            <div className="form-group mb-3">
              <h2>Login</h2>
              <label htmlFor="email"><i className="fa-solid fa-envelope"></i> Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                autoComplete="off"
                value={userData.email}
                name="email"
                onChange={(e) => setUserData({...userData, email:e.target.value})}
                required
              />
            </div>

            <div className="form-group  mb-3">
              <label htmlFor="password"><i className="fa-solid fa-lock"></i> Password</label>
              <div className="input-box">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  autoComplete="off"
                  value={userData.password}
                  name="password"
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  required
                />
                <span className="eye" onClick={hide}>
                  <i id="hideeye1" className="fa-regular fa-eye"></i>
                  <i id="hideeye2" className="fa-regular fa-eye-slash"></i>
                </span>
              </div>
            </div>
            <div id="wrongpassword" style={{ color: "black", paddingBottom: ".7rem" }}>
              {invalidCredentialsErr}
            </div>
            <div className='d-flex justify-content-between'>
              <button type="submit" className="signbtn">
                Login
              </button>
              <NavLink to="/signup" className="already"> Need an account?</NavLink>
            </div>
            <div className="line-container">
              <span className="text-between">or</span>
            </div>
            <div className="sociallog">
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                className="col-md-6">
                <GoogleLogin className="btn bg-dark"
                  onSuccess={(credentialResponse) => {
                    const decoded = jwtDecode(credentialResponse.credential);
                    console.log("Decoded Google login:", decoded);

                    googleLoginUser({email: decoded.email, name: decoded.name, image: decoded.picture});
                  }}
                  style={{ backgroundColor: "green", width: "5rem" }}
                  onFailure={(error) => {
                    console.error(error);
                  }}
                  redirect_uri={process.env.REACT_APP_REDIRECT_URI}
                >
                  <span>Log in with Google</span>
                </GoogleLogin>
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login
