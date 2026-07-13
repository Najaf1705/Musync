import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setAuthLoading } from "../../redux/features/auth/authSlice";
import { authenticateWithGoogle, fetchCurrentUser } from "../../redux/features/auth/authThunks";
import { useNavigate } from "react-router-dom";

export default function GoogleOneTapLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const loadScript = () => {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);

            script.onload = initializeGoogle;
        };

        const initializeGoogle = () => {
            window.google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });

            window.google.accounts.id.prompt();
        };

        const handleCredentialResponse = async (response) => {
            const idToken = response.credential;
            const decodedToken = jwtDecode(idToken);
            console.log(decodedToken); // { sub, email, name, picture, ... }
            dispatch(setAuthLoading(true));
            try {
                const result = await dispatch(authenticateWithGoogle({ idToken })).unwrap();

                if (result.requiresPassword) {
                    const email = result.email ?? "";
                    navigate("/setpassword", { state: { email, token: idToken, idToken, usecase: "google" } });
                    return;
                }

                await dispatch(fetchCurrentUser()).unwrap();
                navigate("/");
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("Google signin error", err);
            } finally {
                dispatch(setAuthLoading(false));
            }
        };

        loadScript();
    }, []);

    return null;
}