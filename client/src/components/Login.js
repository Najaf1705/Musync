import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../redux/features/userSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hide = () => {
    if(document.getElementById("password").type==='password'){
      document.getElementById("password").type="text";
      document.getElementById("hideeye1").style.display="block";
      document.getElementById("hideeye2").style.display="none";
    }else{
      document.getElementById("password").type="password";
      document.getElementById("hideeye1").style.display="none";
      document.getElementById("hideeye2").style.display="block";
    }
  }

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/serverlogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password
        })
      });

      const serRes = await res.json();
      
      if (res.status === 401 || !serRes) {
        document.getElementById("wrongpassword").innerHTML = "Invalid credentials"
        setTimeout(() => {
          document.getElementById("wrongpassword").innerHTML = ""
        }, 3000);
        return;
      }
      
      // Fetch user details after successful login
      const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/serverprofile`, {
        credentials: 'include'
      });
      const userData = await userResponse.json();
      
      dispatch(setUserDetails(userData));
      toast.success("Logged in Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const sendGoogleLogInInfo = async (email) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/googleserverlogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (response.status === 401 || !data) {
        toast.error("User doesn't exist!! Try registering");
        navigate("/signup");
        return;
      }

      // Fetch user details after successful Google login
      const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/serverprofile`, {
        credentials: 'include'
      });
      const userData = await userResponse.json();
      
      dispatch(setUserDetails(userData));
      toast.success("Logged in Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
    <div className="mlogin">
      <div className="container mt-3 d-flex flex-column align-items-center">
        <form onSubmit={loginUser} className='login col-md-5'>
            <div className="form-group mb-3">
              <h2>Login</h2>
              <label htmlFor="email"><i className="fa-solid fa-envelope"></i> Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                autoComplete="off"
                value={email}
                name="email"
                onChange={(e)=>setEmail(e.target.value)}
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
                  value={password}
                  name="password"
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                />
                <span className="eye" onClick={hide}>
                  <i id="hideeye1" className="fa-regular fa-eye"></i>
                  <i id="hideeye2" className="fa-regular fa-eye-slash"></i>
                </span>
              </div>
            </div>
            <div id="wrongpassword" style={{color: "black", paddingBottom:".7rem"}}>
            
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
                    const googleEmail = decoded.email; 

                    sendGoogleLogInInfo(googleEmail);
                    // console.log(decoded);
                    // console.log(googleEmail);
                  }}
                  style={{backgroundColor: "green", width: "5rem"}}
                  onFailure={(error) => {
                    console.error(error);
                  }}
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
