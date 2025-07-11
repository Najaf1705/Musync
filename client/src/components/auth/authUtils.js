import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/features/userSlice"; // adjust path as needed
import { setUserSongs, clearSongSlice } from "../../redux/features/songSlice"; // adjust path as needed
import { toast } from "react-toastify";
import { showErrorToast, showInfoToast, showSuccessToast } from "../utils/toast";


export const useAuthUtils = () => {

    const [invalidCredentialsErr, setInvalidCredentialsErr] = useState("");
    const [loginLoading, setLoginLoading]=useState(false);
    const [signupLoading, setSignupLoading]=useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    // Function to handle user login
    const loginUser = async (userData) => {
        const { email, password } = userData;
        try {
            setLoginLoading(true);
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/serverlogin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // important!
                body: JSON.stringify({ email, password }),
            });
            
            // await new Promise((resolve) => {
            //     setTimeout(() => {
            //         resolve();
            //     }, 6000);
            // });

            const serRes = await res.json();
            console.log("serRes", serRes);

            if (res.status === 401 || !serRes) {
                setInvalidCredentialsErr("Invalid Credentials");
                setTimeout(() => setInvalidCredentialsErr(""), 3000);
                return;
            }

            dispatch(setUser(serRes.user));
            dispatch(setUserSongs({likedSongs: serRes.user.likedSongs, userPlaylists: serRes.user.playlists})); // set liked songs

            showSuccessToast("Logged in Successfully");
            navigate("/");
        } catch (error) {
            console.error("Error:", error);
        }finally{
            setLoginLoading(false);
        }
    }


    // Function to handle Google login
    const googleLoginUser = async (userData) => {
        const { email, name, image } = userData;
        try {
            setLoginLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/googleserverlogin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.status === 409 || !data) {
                // If user doesn't exists, try signing them up
                try {
                    await googleSignupUser(userData);
                } catch (error) {
                    navigate("/signup");
                }
                return;
            }

            console.log("google login data", data);
            dispatch(setUser(data.user));
            dispatch(clearSongSlice());

            showSuccessToast("Logged in Successfully");
            navigate("/");
        } catch (error) {
            console.error("Error:", error);
        } finally{
            setLoginLoading(false);
        }
    };

    // Function to handle user signup
    const signupUser = async (userData) => {
        const { name, email, password, cpassword } = userData;

        try {
            setSignupLoading(true);

            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/serverregister`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password, cpassword
                })
            });

            // await new Promise((resolve) => {
            //     setTimeout(() => {
            //         resolve();
            //     }, 6000);
            // });

            if (res.status === 409) {
                showInfoToast("User already exists!! Try logging in");
                navigate("/login");
                return;
            }

            if (res.status === 400) {
                showErrorToast("Please fill all the fields");
                return;
            }

            if (res.status === 201) {
                await loginUser(userData); // Call loginUser to log in the user after successful registration
                showSuccessToast("Registered Successfully");
                navigate("/");
                return;
            }
        } catch (error) {
            console.error("Error:", error);
        } finally{
            setSignupLoading(false);
        }
    }

    // Function to handle Google signup
    const googleSignupUser = async (userData) => {
        const { email, name, image } = userData;
        try {
            setSignupLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/googleserverregister`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, name, image }),
            });

            if (response.status === 409) {
                // If user already exists, try logging in
                showInfoToast("User already exists!! Logging in...");
                try {
                    await googleLoginUser(userData);
                } catch (error) {
                    navigate("/login");
                }
                return;
            }


            if (response.status === 201) {
                showSuccessToast("Registered Successfully");
                try {
                    await googleLoginUser(userData); // Call googleLoginUser to log in the user after successful registration
                } catch (error) {
                    navigate("/login");
                }
                return;
            }
        } catch (error) {
            console.error("Error:", error);
        }finally{
            setSignupLoading(false);
        }
    };

    return { loginUser, invalidCredentialsErr, googleLoginUser, signupUser, googleSignupUser, isLoggedIn, loginLoading, signupLoading };
};