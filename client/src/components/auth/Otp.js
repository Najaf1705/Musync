import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { loginUser, signupUser } from '../../redux/features/auth/authThunks';
import { useDispatch, useSelector } from 'react-redux';

function Otp() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isAuthLoading, isAuthenticated} = useSelector((state) => state.auth);
  const [email] = useState(location.state?.email ?? "");
  const [name] = useState(location.state?.name ?? "");
  const [password] = useState(location.state?.password ?? "");
  const [otpId] = useState(location.state?.otpId ?? "");
  const [loginMode] = useState(location.state?.loginMode ?? "");
  const [usecase] = useState(location?.state?.usecase); 
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [errEntity, setErrEntity] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  console.log("Otp component state:", { email, name, password, otpId, loginMode, usecase });

    const setFieldError = (field, message) => {
    setErrEntity(field);
    setError(message);
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);


  useEffect(() => {
    if (!email) {
      setFieldError("email", 'Please enter your email on the login page first.');
    }
  }, [email]);

  const handleOtpSubmit = async(e) => {
    e.preventDefault();
    if (!email) {
      setFieldError("email", 'Email is required.');
      return;
    }
    if (otp.length !== 6) {
      setFieldError("otp", 'Please enter a valid 6-digit OTP.');
      return;
    }
    setFieldError("", "");

    try {
      if (usecase === "signup") {
        await dispatch(signupUser({ name, email, password, otp, otpId })).unwrap();
        navigate("/", { replace: true });
      } else if (usecase === "login") {
        await dispatch(loginUser({ email, loginMode: "OTP", password, otpId, otp })).unwrap();
        navigate("/", { replace: true });
      } else {
        throw new Error("No verification handler provided for this usecase");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setFieldError("otp", msg);
    } finally {

    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-white/10 shadow-xl shadow-gray-500/10 p-8 mt-16 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Enter OTP</h2>
          <p className="text-neutral-400 text-sm">
            {email ? `OTP sent to ${email}` : 'Enter your email on the login page first.'}
          </p>
        </div>


        {email ? (
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
                disabled={otpLoading}
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition ${otpLoading || otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={otpLoading || otp.length !== 6}
            >
              {otpLoading ? <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> : 'Login'}
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
        {error &&
          <div className=" mt-3 mb-0.5 border-2 border-[#f3c3cc] bg-[#fdecef] px-3.5 py-2 font-mono text-[13px] text-black">
            {error}
          </div>
        }
      </div>
    </div>
  );
}

export default Otp;