import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import GoogleLoginBtn from './GoogleLoginBtn';
import { loginUser } from '../../redux/features/auth/authThunks';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isAuthLoading, isAuthenticated} = useSelector((state) => state.auth);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate('/'); // Redirect to home or dashboard
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  const [email, setEmail] = useState("");

  const isValidEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleUseOtp = async () => {
    if (isValidEmail(email)) {
      const res = await dispatch(loginUser({ email, loginMode: "OTP" })).unwrap();
      const otpId=res.otpId;
      navigate('/login/otp', { replace: true, state: { email, otpId, loginMode: "OTP", usecase: "login" } });
    }
  };

  const handleUsePassword = () => {
    if (isValidEmail(email)) {
      navigate('/login/password', { state: { email }, replace: true});
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-white/10 shadow-xl shadow-gray-500/10 p-8 mt-16 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
        </div>

        {/* Error message */}
        {/* {invalidCredentialsErr !== "" && (<div className="text-red-400 text-sm min-h-[1.5rem]">{invalidCredentialsErr}</div>)} */}

        {/* Email Input - Always shown initially */}
          <form className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-neutral-300 mb-1">
                <i className="fa-solid fa-envelope mr-2"></i>Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                id="email"
                placeholder="Enter your email"
                autoComplete="off"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginLoading}
                required
              />
            </div>
            {isValidEmail(email) && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleUseOtp}
                  className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition ${
                    loginLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loginLoading}
                >
                  Use OTP
                </button>
                <button
                  type="button"
                  onClick={handleUsePassword}
                  className={`flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition ${
                    loginLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loginLoading}
                >
                  Use Password
                </button>
              </div>
            )}
          </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-neutral-700"></div>
          <span className="mx-3 text-neutral-400">or</span>
          <div className="flex-grow border-t border-neutral-700"></div>
        </div>

        {/* Google Login */}

        {/* Signup link */}

          <div className="flex justify-between items-center text-center mt-4">
            <NavLink to="/signup" className={`text-green-400 hover:underline text-sm ${loginLoading ? "pointer-events-none opacity-50" : ""}`}>
              Need an account?
            </NavLink>
            <GoogleLoginBtn/>
          </div>
    
      </div>
    </div>
  );
}

export default Login
