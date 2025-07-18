import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserSongs } from "../../redux/features/songSlice";
import { setUser } from "../../redux/features/userSlice";
import { showErrorToast, showInfoToast, showSuccessToast } from "../utils/toast";

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
                `${process.env.REACT_APP_BACKEND_URL}/userExists?email=${encodeURIComponent(email)}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );

            const data = await response.json();
            return !!data.exists; // expects { exists: true/false }
        } catch (error) {
            console.error("Error checking user existence:", error);
            return false; // default to false on error
        }
    };

    // ✅ Handle login logic
    const loginUser = async (userData) => {
        const { email, password = null, type } = userData;
        try {
            setLoginLoading(true);

            // prepare payload
            const payload = { email, type: type || "email" };
            if (password !== null) payload.password = password;
            console.log(`${process.env.REACT_APP_BACKEND_URL}/login`);

            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const serRes = await res.json();

            if (!res.ok) {
                const msg =
                    res.status === 404
                        ? "User not found"
                        : res.status === 401
                            ? "Invalid credentials"
                            : serRes?.error || "Login failed";

                setInvalidCredentialsErr(msg);
                setTimeout(() => setInvalidCredentialsErr(""), 3000);
                return;
            }

            // ✅ Login success
            dispatch(setUser(serRes.user));
            dispatch(
                setUserSongs({
                    likedSongs: serRes.user.likedSongs,
                    userPlaylists: serRes.user.playlists,
                })
            );

            showSuccessToast("Logged in Successfully");
            navigate("/");
        } catch (error) {
            console.error("Login Error:", error);
            setInvalidCredentialsErr("Network error");
            setTimeout(() => setInvalidCredentialsErr(""), 3000);
        } finally {
            setLoginLoading(false);
        }
    };

    // Handle signup logic
    const signupUser = async (userData) => {
        const { name, email, password, image=null } = userData;

        try {
            setSignupLoading(true);

            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, email, password, image }),
            });

            if (res.status === 400) {
                showErrorToast("Please fill all the fields");
                return;
            }

            if (res.status === 409) {
                showInfoToast("User already exists! Try logging in");
                navigate("/login");
                return;
            }

            if (res.status === 201) {
                const data = await res.json();

                // ✅ backend already logs the user in after signup
                dispatch(setUser(data.user));
                dispatch(
                    setUserSongs({
                        likedSongs: data.user.likedSongs,
                        userPlaylists: data.user.playlists,
                    })
                );

                showSuccessToast("Registered Successfully");
                navigate("/");
            }
        } catch (error) {
            console.error("Signup Error:", error);
            showErrorToast("Something went wrong during signup");
        } finally {
            setSignupLoading(false);
        }
    };

    // Exported functions
    return {
        invalidCredentialsErr,
        isLoggedIn,
        loginLoading,
        signupLoading,
        userExists,
        loginUser,
        signupUser,
    };
};
