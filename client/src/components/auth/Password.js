import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/features/auth/authThunks';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import { useSelect } from '@heroui/react';

function Password() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthLoading = useSelect((state) => state.auth.isAuthLoading);
  const isAuthenticated = useSelect((state) => state.auth.isAuthenticated);
  const [email, setEmail] = useState(location?.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errEntity, setErrEntity] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  useEffect(() => {
    if (!email) {
      setError('Please enter your email on the login page first.');
      console.log('Email not provided. Redirecting to login page.');
    }
  }, [email]);

  const validate = () => {
    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };



  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);

    if (!email) {
      setError('Email is required. Go back to login and enter your email.');
      return;
    }

    if (!validate()) return;


    try {
      await dispatch(loginUser({ email, loginMode: "PASSWORD", password })).unwrap();
      showSuccessToast("Login successful");
      navigate("/", {
        replace: true,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setError(msg);
      showErrorToast(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-white/10 shadow-xl shadow-gray-500/10 p-8 mt-16 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Enter Password</h2>
          <p className="text-neutral-400 text-sm">
            {email ? `Continue with ${email}` : 'Enter your email on the login page first.'}
          </p>
        </div>


        {email ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-neutral-300 mb-1">
                <i className="fa-solid fa-lock mr-2"></i>Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoFocus
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginLoading}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition ${loginLoading || !password ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={loginLoading || !password}
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
                onClick={() => setPassword('')}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Clear
              </button>
            </div>
            {error &&
              <div className=" mt-3 mb-0.5 border-2 border-[#f3c3cc] bg-[#fdecef] px-3.5 py-2 font-mono text-[13px] text-black">
                {error}
              </div>
            }
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

export default Password;
