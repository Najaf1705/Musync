import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthUtils } from './authUtils';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { useSelector } from 'react-redux';

const Signup = () => {
  const location=useLocation();
  const { isLoggedIn } = useSelector((state) => state.user);
  const { normalSignup, userExists, loginUser, signupLoading } = useAuthUtils();
  const navigate = useNavigate();
  const initialUserData=location?.state || {};


  // const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [googleSignupUserDetails, setGoogleSignupUserDetails] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', {replace: true}); // Redirect to home or dashboard
    }
  }, [isLoggedIn, navigate]);

  const [userData, setUserData] = useState({
    name: "", email: initialUserData.email, password: initialUserData.password, cpassword: initialUserData.password
  });
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modalPass, setModalPass] = useState('');

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    if (name === "password") {
      setPasswordMismatch(value !== userData.cpassword);
    }
    if (name === "cpassword") {
      setPasswordMismatch(userData.password !== value);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const { email, name, picture } = decoded;
    setGoogleSignupUserDetails({ name, email, image: picture });
    const user = await userExists(email);
    if (user) {
      // If user exists, log them in
      await loginUser({ email, type: "google" });
    } else {
      // If user does not exist, set details for signup
      setIsModalOpen(true);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-md rounded-xl border border-white/10 shadow-xl shadow-white/10 p-8 mt-2 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              normalSignup(userData);
            }}
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
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
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
            <div>
              <label htmlFor="password" className="block text-neutral-300 mb-1">
                <i className="fa-solid fa-lock mr-2"></i>Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                id="password"
                placeholder="Password"
                required
                autoComplete="off"
                value={userData.password}
                name="password"
                onChange={handleInputs}
                disabled={signupLoading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-neutral-300 mb-1">
                <i className="fa-solid fa-lock mr-2"></i>Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  autoComplete="off"
                  value={userData.cpassword}
                  name="cpassword"
                  onChange={handleInputs}
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
            {passwordMismatch && (
              <div className="text-red-400 text-sm pb-2">
                Passwords do not match. Please try again.
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                {signupLoading ? (
                  <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                ) : (
                  "Register"
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
            <button
              className={`${signupLoading ? "pointer-events-none opacity-50" : ""}`}
            >
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onFailure={(error) => {
                    console.error(error);
                  }}
                  width="100%"
                  theme="filled_black"
                  text="continue_with"
                  shape="pill"
                />
              </GoogleOAuthProvider>
            </button>
          </div>
        </div>
      </div>

      <Modal
        backdrop="opaque"
        placement='center'
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
        classNames={{
          body: "py-6",
          backdrop: "bg-black/80 backdrop-opacity-40",
          base: "border-[#1f1f1f] bg-[#121212] text-[#e0e0e0]",
          closeButton: "hover:bg-white/5 active:bg-white/10 top-2 right-2",
        }}
      >
        <ModalContent 
          className="max-w-md mx-auto bg-[#7a7a7a] text-[#e0e0e0] rounded-lg shadow-lg"
        >
          {(onClose) => (
            <form
              onSubmit={async(e) => {
                e.preventDefault();
                setGoogleSignupUserDetails({ ...googleSignupUserDetails, password: modalPass, type: "google" });
                await normalSignup({...googleSignupUserDetails, password: modalPass });
                setGoogleSignupUserDetails(null);
              }}
            >
              <ModalHeader className="text-white font-semibold text-xl pt-4 pb-0">
                Create Password
              </ModalHeader>
              <ModalBody>
                <input
                  type="password"
                  value={modalPass}
                  onChange={(e) => setModalPass(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter password"
                  autoFocus
                />
              </ModalBody>
              <ModalFooter className="flex justify-end items-center gap-4 p-4">
                <Button onPress={onClose}>Cancel</Button>
                <Button
                  type="submit"
                  className='bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2'
                >
                  Create
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Signup;