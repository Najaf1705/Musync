import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { replace, useNavigate } from "react-router-dom";
import { setUserSongsThunk } from "../../redux/features/song/songThunks";
import { setUser } from "../../redux/features/userSlice";
import { showErrorToast, showInfoToast, showSuccessToast } from "../utils/toast";
import { getOtp, getOtpThunk, googleLoginThunk, googleSignupThunk, normalLoginThunk, normalSignupThunk } from "../../redux/features/authThunks";

export const useAuthUtils = () => {
    const [invalidCredentialsErr, setInvalidCredentialsErr] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [signupLoading, setSignupLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    // ✅ Check if user exists
    const userExists = async (email) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/userExists?email=${encodeURIComponent(email)}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );

            const data = await response.json();
            return !!data.exists; // expects { exists: true/false }
        } catch (error) {
            return false; // default to false on error
        }
    };

    const googleLogin = async ({token, password=null}) => {
        try {
            setLoginLoading(true);

            const responseJson = await dispatch(
                googleLoginThunk({token, password})
            ).unwrap();

            // ✅ Existing user → login success
            if (responseJson.user) {
                dispatch(setUser(responseJson.user));

                dispatch(
                    setUserSongsThunk({
                        likedSongs: responseJson.user.likedSongs,
                        userPlaylists: responseJson.user.playlists,
                    })
                );

                showSuccessToast("Logged in Successfully");
                navigate("/", {replace: true});
                return;
            }
        } catch (error) {
            if (error?.status===409) {
                showInfoToast("Create a suitable password");

                navigate("/register/setpassword", {
                    replace: true,
                    state: {
                        token // 🔥 critical
                    },
                });

                return;
            }
            showErrorToast(error?.data?.message || "Login failed");
        } finally {
            setLoginLoading(false);
        }
    };


    // const googleSignup = async (signupData) => {
    //     try {
    //         setSignupLoading(true);

    //         const responseJson = await dispatch(
    //             googleSignupThunk(signupData)
    //         ).unwrap();

    //         dispatch(setUser(responseJson.user));

    //         dispatch(
    //             setUserSongsThunk({
    //                 likedSongs: responseJson.user.likedSongs,
    //                 userPlaylists: responseJson.user.playlists,
    //             })
    //         );

    //         showSuccessToast("Signed in Successfully");
    //         navigate("/");
    //         return;
    //     } catch (error) {
    //         const status = error?.status;

    //         if (status === 400) {
    //             showErrorToast("Invalid email");
    //             return;
    //         }

    //         showErrorToast(error?.data?.message || "Signup failed");
    //     } finally {
    //         setSignupLoading(false);
    //     }
    // };




    const normalLogin = async (loginData) => {
        try {
            setLoginLoading(true);

            const response = await dispatch(
                normalLoginThunk(loginData)
            ).unwrap();

            dispatch(setUser(response.user));

            dispatch(
                setUserSongsThunk({
                    likedSongs: response.user.likedSongs,
                    userPlaylists: response.user.playlists,
                })
            );

            showSuccessToast("Logged in successfully");
            navigate("/", {replace: true});

        } catch (error) {
            const status = error?.status;

            if (status === 400) return showErrorToast("Invalid email");
            if (status === 401) return showErrorToast("Incorrect password");

            if (status === 404) {
                showInfoToast("User not found, please register");

                navigate("/signup", {
                    replace: true,
                    state: loginData,
                    parent: "login"
                });

                return;
            }

            showErrorToast("Login failed");

        } finally {
            setLoginLoading(false);
        }
    };

    // Handle signup logic
    const normalSignup = async (signupData) => {
        try {
            setSignupLoading(true);

            const responseJson = await dispatch(
                normalSignupThunk(signupData)
            ).unwrap();
            console.log("user data at reg", responseJson);

            if(responseJson.status==="otp_required"){
                navigate('/register/otp', {
                    replace: true,
                    state: {...signupData, otpId: responseJson.otpId},
                    parent: "signup",
                })
                return;
            }

            dispatch(setUser(responseJson.user));

            dispatch(
                setUserSongsThunk({
                    likedSongs: responseJson.user.likedSongs,
                    userPlaylists: responseJson.user.playlists,
                })
            );

            showSuccessToast("Signed in Successfully");
            navigate("/", {replace: true});
            return;
        } catch (error) {
            const status = error?.status;

            if (status === 400) {
                showErrorToast("Invalid email");
                return;
            }

            showErrorToast(error?.data?.message || "Signup failed");
        } finally {
            setSignupLoading(false);
        }
    };

    const generateOtp = async (email) => {
        try {
            const response = await dispatch(getOtpThunk(email)).unwrap();

            showSuccessToast(
                `OTP sent to ${email}. OTP Id: ${response.otpId}`
            );

            return { otpId: response.otpId };

        } catch (error) {
            showErrorToast(error?.data?.message || "OTP error");
        }
    };

    // Exported functions
    return {
        invalidCredentialsErr,
        isLoggedIn,
        loginLoading,
        signupLoading,
        userExists,
        normalLogin,
        normalSignup,
        googleLogin,
        // googleSignup,
        generateOtp
    };
};
