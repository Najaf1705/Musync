import React, { useState, useEffect, use } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import GoogleLoginBtn from './GoogleLoginBtn';
import { signupUser } from '../../redux/features/auth/authThunks';

const Signup = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, isAuthLoading } = useSelector((state) => state.auth);
  const [signupLoading, setSignupLoading] = useState(false);
  const navigate = useNavigate();
  const initialUserData = location?.state || {};
  const [error, setError] = useState("");
  const [errEntity, setErrEntity] = useState("");



  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate('/', { replace: true }); // Redirect to home or dashboard
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  const [userData, setUserData] = useState({
    name: "", email: initialUserData.email, password: initialUserData.password, cpassword: initialUserData.password
  });

  const setFieldError = (field, message) => {
    setErrEntity(field);
    setError(message);
  };


  const handleInputs = (e) => {
    setFieldError("", ""); // Clear previous error when user starts typing
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const validate = () => {
    if (!userData.name.trim()) {
      setFieldError("name", "Name is required");
      return false;
    }
    if (!userData.email.trim()) {
      setFieldError("email", "Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      setFieldError("email", "Enter a valid email");
      return false;
    }

    setError("");
    return true;
  };

  async function handleSignup(e) {
    // e.preventDefault();
    if (!validate()) return;
    navigate("/setpassword", {
      state: { name: userData.name, email: userData.email, usecase: "signup" },
    });
  }


  return (
    <>
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-md rounded-xl border border-white/10 shadow-xl shadow-white/10 p-8 mt-2 backdrop-blur-sm">
          <form
            onSubmit={(e) => handleSignup(e)}
            className={`space-y-6 ${signupLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Registration</h2>
            </div>
            <div>
              <label htmlFor="firstName" className="block text-neutral-300 mb-1">
                <i className="fa-solid fa-user mr-2"></i>Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                id="firstName"
                placeholder="Name"
                required
                autoFocus
                autoComplete="off"
                value={userData.name}
                name="name"
                onChange={handleInputs}
                disabled={signupLoading}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-neutral-300 mb-1">
                <i className="fa-solid fa-envelope mr-2"></i>Email
              </label>
              <input
                type="email"
                className="w-full  px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                id="email"
                placeholder="Email"
                required
                autoComplete="off"
                value={userData.email}
                name="email"
                onChange={handleInputs}
                disabled={signupLoading}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                {signupLoading ? (
                  <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                ) : (
                  "Next"
                )}
              </button>
              <NavLink to="/login" className={`text-green-400 hover:underline text-sm ${signupLoading ? "pointer-events-none opacity-50" : ""}`}>
                Already have an account?
              </NavLink>
            </div>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-neutral-700"></div>
              <span className="mx-3 text-neutral-400">or</span>
              <div className="flex-grow border-t border-neutral-700"></div>
            </div>
          </form>



          <div className="flex justify-center mt-2">
            <GoogleLoginBtn />
          </div>
          {error &&
            <div className=" mt-3 mb-0.5 border-2 border-[#f3c3cc] bg-[#fdecef] px-3.5 py-2 font-mono text-[13px] text-black">
              {error}
            </div>
          }
        </div>
      </div>

    </>
  )
};

export default Signup;