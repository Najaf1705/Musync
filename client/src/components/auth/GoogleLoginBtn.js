import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthUtils } from './authUtils';

function GoogleLoginBtn() {
    const { googleLogin, loginLoading } = useAuthUtils();
    return (
        <div className="flex justify-center mt-2">
            {/* <button
                className={`${loginLoading ? "pointer-events-none opacity-50" : ""}`}
            > */}
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        console.log(credentialResponse.credential)
                        googleLogin({
                            token: credentialResponse.credential, // ✅ send this only
                        });
                    }}
                    onError={() => {
                        console.error("Login Failed");
                    }}
                />
            </GoogleOAuthProvider>
            {/* </button> */}
        </div>)
}

export default GoogleLoginBtn