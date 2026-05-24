import { useEffect } from "react";
import { useAuthUtils } from "./authUtils";
import { jwtDecode } from "jwt-decode";

export default function GoogleOneTapLogin() {
      const { googleLogin } = useAuthUtils();

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
            const decoded = jwtDecode(response.credential);
            googleLogin({
                token: response.credential
            });
        };

        loadScript();
    }, []);

    return null;
}