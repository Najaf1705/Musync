import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthUtils } from './authUtils';

const Setpassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { googleLogin, signupLoading } = useAuthUtils();
  const token = location?.state?.token || '';

  const [userData, setUserData] = useState({
    password: '',
    cpassword: '',
  });
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // useEffect(() => {
  //   if (!userData.email) {
  //     navigate('/signup');
  //   }
  // }, [userData.email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    if (name === 'cpassword') {
      setPasswordMismatch(userData.password !== value);
    } else if (name === 'password') {
      setPasswordMismatch(value !== userData.cpassword);
    }
  };

  const handleSubmit = (e) => {
    console.log("pass", userData.password)
    e.preventDefault();
    if (userData.password !== userData.cpassword) {
      setPasswordMismatch(true);
      return;
    }
    googleLogin({token, password: userData.password});
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-white/10 shadow-xl shadow-gray-500/10 p-8 mt-16 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Set Password</h2>
          <p className="text-neutral-400 text-sm">Create a password for {userData.email}</p>
        </div>

        <form onSubmit={handleSubmit} className={`space-y-6 ${signupLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
          <div>
            <label htmlFor="password" className="block text-neutral-300 mb-1">
              <i className="fa-solid fa-lock mr-2"></i>Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                id="password"
                placeholder="Enter password"
                autoComplete="new-password"
                value={userData.password}
                name="password"
                onChange={handleChange}
                required
                disabled={signupLoading}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="cpassword" className="block text-neutral-300 mb-1">
              <i className="fa-solid fa-lock mr-2"></i>Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                id="cpassword"
                placeholder="Confirm password"
                autoComplete="new-password"
                value={userData.cpassword}
                name="cpassword"
                onChange={handleChange}
                required
                disabled={signupLoading}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <i className={`fa-regular ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            {passwordMismatch && (
              <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition ${
              signupLoading || passwordMismatch ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={signupLoading || passwordMismatch}
          >
            {signupLoading ? (
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
            ) : (
              "Set password"
              // `${registerationType==="google"?"Set Password":"Verify email"}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setpassword;