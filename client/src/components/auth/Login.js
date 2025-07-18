import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useAuthUtils } from './authUtils'; // adjust path as needed

const Login = () => {
  const { loginUser, invalidCredentialsErr, isLoggedIn, loginLoading } = useAuthUtils();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/'); // Redirect to home or dashboard
    }
  }, [isLoggedIn, navigate]);

  const [userData, setUserData] = useState({
    email: "", password: "", type: "email"
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-white/10 shadow-xl shadow-gray-500/10 p-8 mt-16 backdrop-blur-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginUser(userData);
          }}
          className={`space-y-6 ${loginLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
          </div>
          <div>
            <label htmlFor="email" className="block text-neutral-300 mb-1">
              <i className="fa-solid fa-envelope mr-2"></i>Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              id="email"
              placeholder="Email"
              autoComplete="off"
              value={userData.email}
              name="email"
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
              disabled={loginLoading} // Disable Google Login when loading
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-neutral-300 mb-1">
              <i className="fa-solid fa-lock mr-2"></i>Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                id="password"
                placeholder="Password"
                autoComplete="off"
                value={userData.password}
                name="password"
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                required
                disabled={loginLoading} // Disable Google Login when loading
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
          </div>
          <div className="text-red-400 text-sm min-h-[1.5rem]">{invalidCredentialsErr}</div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition ${loginLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
              ) : (
                "Login"
              )}
            </button>
            <NavLink to="/signup" className={`text-green-400 hover:underline text-sm ${loginLoading ? "pointer-events-none opacity-50" : ""}`}>
              Need an account?
            </NavLink>
          </div>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-neutral-700"></div>
            <span className="mx-3 text-neutral-400">or</span>
            <div className="flex-grow border-t border-neutral-700"></div>
          </div>
        </form>


        <div className="flex justify-center mt-2">
          <button
            className={`${loginLoading ? "pointer-events-none opacity-50" : ""}`}
          >
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  loginUser({
                    email: decoded.email,
                    type: "google"
                  });
                }}
                onFailure={(error) => {
                  console.error(error);
                }}
                redirect_uri={process.env.REACT_APP_REDIRECT_URI}
                width="100%"
                theme="filled_black"
                text="continue_with"
                shape="pill"
                disabled={loginLoading} // Disable Google Login when loading
              />
            </GoogleOAuthProvider>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login
