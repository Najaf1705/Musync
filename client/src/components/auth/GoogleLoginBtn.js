import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { authenticateWithGoogle, fetchCurrentUser } from '../../redux/features/auth/authThunks';
import { useDispatch } from 'react-redux';
import { setAuthLoading } from '../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '../utils/toast';

function GoogleLoginBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <div className="flex justify-center mt-2">
            {/* <button
                className={`${loginLoading ? "pointer-events-none opacity-50" : ""}`}
            > */}
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                    onSuccess={async(credentialResponse) => {
                        const idToken = credentialResponse.credential;
                        console.log(idToken);
                        dispatch(setAuthLoading(true));
                        try {
                            const result = await dispatch(authenticateWithGoogle({ idToken })).unwrap();
                            console.log("Google login result:", result);
                            if (result.requiresPassword) {
                                const email = result.email ?? "";
                                navigate("/setpassword", { state: { email, token: idToken, idToken, usecase: "google" } });
                                return;
                            }

                            await dispatch(fetchCurrentUser()).unwrap();
                            showSuccessToast("Logged in Successfully");
                            navigate("/");
                        } catch (err) {
                            // eslint-disable-next-line no-console
                            console.error("Google signin error", err);
                        } finally {
                            dispatch(setAuthLoading(false));
                        }
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