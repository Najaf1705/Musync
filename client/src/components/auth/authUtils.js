import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/features/userSlice"; // adjust path as needed
import { setUserSongs, clearSongSlice } from "../../redux/features/songSlice"; // adjust path as needed
import { toast } from "react-toastify";


export const useAuthUtils = () => {

    const [invalidCredentialsErr, setInvalidCredentialsErr] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    // Function to handle user login
    const loginUser = async (userData) => {
        const { email, password } = userData;
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/serverlogin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // important!
                body: JSON.stringify({ email, password }),
            });

            const serRes = await res.json();
            console.log("serRes", serRes);

            if (res.status === 401 || !serRes) {
                setInvalidCredentialsErr("Invalid Credentials");
                setTimeout(() => setInvalidCredentialsErr(""), 3000);
                return;
            }

            dispatch(setUser(serRes.user));
            dispatch(setUserSongs({likedSongs: serRes.user.likedSongs, userPlaylists: serRes.user.playlists})); // set liked songs

            toast.success("Logged in Successfully");
            navigate("/");
        } catch (error) {
            console.error("Error:", error);
        }
    }


    // Function to handle Google login
    const googleLoginUser = async (userData) => {
        const { email, name, image } = userData;
        try {
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

            toast.success("Logged in Successfully");
            navigate("/");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Function to handle user signup
    const signupUser = async (userData) => {
        const { name, email, password, cpassword } = userData;

        try {

            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/serverregister`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password, cpassword
                })
            });

            if (res.status === 409) {
                toast.warning("User already exists!! Try logging in");
                navigate("/login");
                return;
            }

            if (res.status === 400) {
                toast.error("Please fill all the fields");
                return;
            }

            if (res.status === 201) {
                await loginUser(userData); // Call loginUser to log in the user after successful registration
                toast.success("Registered Successfully");
                navigate("/");
                return;
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Function to handle Google signup
    const googleSignupUser = async (userData) => {
        const { email, name, image } = userData;
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/googleserverregister`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, name, image }),
            });

            if (response.status === 409) {
                // If user already exists, try logging in
                toast.warning("User already exists!! Logging in...");
                try {
                    await googleLoginUser(userData);
                } catch (error) {
                    navigate("/login");
                }
                return;
            }


            if (response.status === 201) {
                toast.success("Registered Successfully");
                try {
                    await googleLoginUser(userData); // Call googleLoginUser to log in the user after successful registration
                } catch (error) {
                    navigate("/login");
                }
                return;
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return { loginUser, invalidCredentialsErr, googleLoginUser, signupUser, googleSignupUser, isLoggedIn };
};