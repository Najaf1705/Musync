import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthLoading } from '../../redux/features/auth/authSlice';
import { authenticateWithGoogle, fetchCurrentUser, signupUser } from '../../redux/features/auth/authThunks';

const Setpassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isAuthLoading } = useSelector((state) => state.auth);
  const idToken = location?.state?.token || location?.state?.idToken || '';
  const email = location?.state?.email || '';
  const usecase = location?.state?.usecase || (idToken ? 'google' : 'signup');
  const name = location?.state?.name || '';
  const [error, setError] = useState('');
  const [errEntity, setErrEntity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const setFieldError = (field, message) => {
    setErrEntity(field);
    setError(message);
  };

  const [userData, setUserData] = useState({
    password: '',
    cpassword: '',
  });

  const handleChange = (e) => {
    setFieldError('', ''); // Clear previous error when user starts typing
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const validate = () => {
    if (!userData.password.trim() && !userData.cpassword.trim()) {
      setFieldError("password", "Password is required");
      return false;
    }
    if (userData.password.trim() !== userData.cpassword.trim()) {
      setFieldError("password", "Passwords do not match");
      return false;
    }

    if (userData.password.trim().length < 4) {
      setFieldError("password", "Atleast 4 chars required");
      return false;
    }

    setFieldError('', '');
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setFieldError('', ''); // Clear previous error when user starts typing
    setPasswordLoading(true);

    try {
      if (usecase === "signup") {
        const signupResponse = await dispatch(signupUser({ name, email, password: userData.password })).unwrap();
        if (signupResponse?.requiresOtp) {
          navigate("/otp", {
            state: { email, name, password: userData.password, otpId: signupResponse.otpId, usecase: "signup" },
          });
          return;
        }

        if (signupResponse?.user) {
          navigate("/");
          return;
        }
      }

      if (usecase === "google") {
        const result = await dispatch(authenticateWithGoogle({ idToken, password: userData.password })).unwrap();
        if (result?.requiresPassword) {
          setFieldError("password", "Google account setup could not be completed");
          return;
        }

        await dispatch(fetchCurrentUser()).unwrap();
        navigate("/");
        return;
      }

      setFieldError("password", "Unable to continue with this auth flow");
    } finally {
      setPasswordLoading(false);
    }
  }


  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-white/10 shadow-xl shadow-gray-500/10 p-8 mt-16 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">{usecase === "signup" ? "Create Account" : "Set Password"}</h2>
          <p className="text-neutral-400 text-sm">{usecase === "signup" ? "Set a password for" : "Update your password"} {email}</p>
        </div>

        <form onSubmit={handleSubmit} className={`space-y-6 ${passwordLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
          <div>
            <label htmlFor="password" className="block text-neutral-300 mb-1">
              <i className="fa-solid fa-lock mr-2"></i>Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full ${errEntity === "password" ? "border-red-500" : "border-[#6b6b6b]"} px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400`}
                id="password"
                placeholder="Enter password"
                autoComplete="new-password"
                value={userData.password}
                name="password"
                onChange={handleChange}
                required
                disabled={passwordLoading}
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
                className={`w-full ${errEntity === "password" ? "border-red-500" : "border-[#6b6b6b]"} px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400`}
                id="cpassword"
                placeholder="Confirm password"
                autoComplete="new-password"
                value={userData.cpassword}
                name="cpassword"
                onChange={handleChange}
                required
                disabled={passwordLoading}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <i className={`fa-regular ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition ${passwordLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={passwordLoading}
          >
            {passwordLoading ? (
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
            ) : (
              "Set password"
              // `${registerationType==="google"?"Set Password":"Verify email"}`
            )}
          </button>
        </form>
        {error &&
          <div className=" mt-3 mb-0.5 border-2 border-[#f3c3cc] bg-[#fdecef] px-3.5 py-2 font-mono text-[13px] text-black">
            {error}
          </div>
        }
      </div>
    </div>
  );
};

export default Setpassword;