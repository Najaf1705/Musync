import React from 'react'
import {GoogleOAuthProvider,GoogleLogin} from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useState } from 'react';
import { NavLink , useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  function hide(){
    if(document.getElementById("confirmPassword").type==='password'){
      document.getElementById("confirmPassword").type="text";
      document.getElementById("hideeye1").style.display="block";
      document.getElementById("hideeye2").style.display="none";
    }else{
      document.getElementById("confirmPassword").type="password";
      document.getElementById("hideeye1").style.display="none";
      document.getElementById("hideeye2").style.display="block";
    }
  }
  
  const navigate=useNavigate();
  const [user,setUser] = useState({
    name:"",email:"",password:"",cpassword:""
  });
  const [passwordMismatch, setPasswordMismatch] = useState(false);


  let inpname,inpvalue;
  const handleInputs=async (e)=>{
    inpname=e.target.name;
    inpvalue=e.target.value;
    setUser({...user, [inpname]:inpvalue});
    if (inpname === "password"){
      console.log("pass   "+user.password);
      setPasswordMismatch(inpvalue !== user.cpassword);
    }
    if (inpname === "cpassword"){
      console.log("cpass   "+user.cpassword);
      setPasswordMismatch(user.password !== inpvalue);
    }
  }

  const postData=async (e)=>{
    e.preventDefault();

    const {name, email, password, cpassword} = user;

    if (password !== cpassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);

    const res=await fetch("/serverregister",{
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        name, email, password, cpassword
      })
    });

    const serRes=await res.json();
    if(res.status===422 || !serRes){
      // document.getElementById("wrongpassword").innerHTML="User already exists. Try logging in";
      // console.log("User already exists");
      toast.warning("User already exists!! Try logging in");
    }else{
      toast.success("Registered Successfully");
      // window.alert("Registered Successfully");
      // console.log("Registered Successfully");
      navigate("/login");
    }
  }

  const sendGoogleSignUpInfo = async (email,name,image) => {
    try {
      const response = await fetch("/googleserverregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email,name,image}),
      });
      const data = await response.json();

      if (data.message) {
        console.log(data.message);
        toast.success("Registered Successfully");
        navigate("/login"); 
      }else if(data.status===422||data.error === 'User already registered with Google'){
        toast.warning("User already exists!! Try logging in");
        navigate("/login");
      }
      else {
        toast.error("Registration Failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <>
      <div className="msignup">
        <div className="container mt-3 d-flex flex-column align-items-center">
          <h2>Registration Form</h2>
          <form onSubmit={postData} className="signup col-md-8">
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="firstName">
                  <i className="fa-solid fa-user"></i> Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="Name"
                  required
                  autoComplete="off"
                  value={user.name}
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
                  value={user.email}
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
                    value={user.password}
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
                    value={user.cpassword}
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
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              className="col-md-6">
                <GoogleLogin 
                  onSuccess={(credentialResponse) => {
                    const decoded = jwtDecode(credentialResponse.credential);
                    const googleEmail = decoded.email; 
                    const name = decoded.name; 
                    const image = decoded.picture; 

                    sendGoogleSignUpInfo(googleEmail,name,image);
                    navigate("/login");
                    console.log(decoded);
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
