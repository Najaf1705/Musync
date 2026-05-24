import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthUtils } from './authUtils';

function Otp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { normalLogin, normalSignup, invalidCredentialsErr, loginLoading, isLoggedIn } = useAuthUtils();
  const [userDetails] = useState(location?.state || {});
  const [parent] = useState(location?.parent); // parent should come from state, not location.parent
  const [otp, setOtp] = useState('');
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    console.log(parent);
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  console.log(userDetails)

  useEffect(() => {
    if (!userDetails.email) {
      setPageError('Please enter your email on the login page first.');
    }
  }, [userDetails.email]);

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!userDetails.email) {
      setPageError('Email is required.');
      return;
    }
    if (otp.length !== 6) {
      setPageError('Please enter a valid 6-digit OTP.');
      return;
    }
    setPageError('');
    if (parent === "login"){
      normalLogin({ email: userDetails.email, otp, otpId: userDetails.otpId, type: 'otp' });
      return;
    }
    normalSignup({ name: userDetails.name, email: userDetails.email, otp, otpId: userDetails.otpId, password: userDetails.password });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-white/10 shadow-xl shadow-gray-500/10 p-8 mt-16 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Enter OTP</h2>
          <p className="text-neutral-400 text-sm">
            {userDetails.email ? `OTP sent to ${userDetails.email}` : 'Enter your email on the login page first.'}
          </p>
        </div>

        <div className="text-red-400 text-sm min-h-[1.5rem] mb-4">{pageError || invalidCredentialsErr}</div>

        {userDetails.email ? (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-neutral-300 mb-1">
                <i className="fa-solid fa-key mr-2"></i>OTP Code
              </label>
              <input
                type="text"
                id="otp"
                placeholder="000000"
                maxLength="6"
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-2xl tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                disabled={loginLoading}
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition ${loginLoading || otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={loginLoading || otp.length !== 6}
            >
              {loginLoading ? <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> : 'Login'}
            </button>

            <div className="flex justify-between gap-3">
              <NavLink
                to="/login"
                className="flex-1 text-center bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Back to Login
              </NavLink>
              <button
                type="button"
                onClick={() => setOtp('')}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Clear
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <NavLink
              to="/login"
              className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Go to Login
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Otp;