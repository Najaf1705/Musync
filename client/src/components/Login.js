import React, {useState} from 'react'
import { NavLink, useNavigate} from 'react-router-dom';
import {GoogleOAuthProvider,GoogleLogin} from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const Login = (props) => {
  function hide(){
    if(document.getElementById("password").type==='password'){
      document.getElementById("password").type="text";
      document.getElementById("hideeye1").style.display="block";
      document.getElementById("hideeye2").style.display="none";
    }else{
      document.getElementById("password").type="password";
      document.getElementById("hideeye1").style.display="none";
      document.getElementById("hideeye2").style.display="block";

    }
  }

  // const [userDetails,setUserDetails]=useState(null);

  const navigate=useNavigate();
  const [email, setEmail] = useState("");
  // const [gemail, setGemail] = useState("");
  const [password, setPassword] = useState("");
  // const [userData, setUserData] = useState({});

  const getUserInfo = async () => {
  try {
    const response = await fetch('/serverprofile', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    // console.log(response);
    return response; 

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

  const loginUser=async (e)=>{
    e.preventDefault();
    const res=await fetch('/serverlogin',{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const serRes=await res.json();
    if(res.status===401||!serRes){
      
      document.getElementById("wrongpassword").innerHTML="Invalid credentials"
      setTimeout(() => {
        document.getElementById("wrongpassword").innerHTML=""
      }, 3000); 
      return;
    }else{
      toast.success("Logged in Successfully");
      const res = await getUserInfo();
      const user = await res.json();
      // setUserData(res.json());
      await props.onLogStateChange(false,user);
      // console.log(user.name);
      localStorage.setItem('isLoggedIn', 'true');
      navigate("/");
    }
  }

  const sendGoogleLogInInfo = async (email) => {
    try {
      const response = await fetch('/googleserverlogin', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email})
      });
      // console.log("Response: ", response);

      const data = await response.json();
      // console.log("Data: ", data);
      
      if(response.status===401||!data){
        toast.error("User dosen't exists!! Try registering");
        navigate("/signup");
        return;
      }
      else {
        toast.success("Logged in Successfully");
        const res = await getUserInfo();
        const user = await res.json();
        // setUserData(res.json());
        await props.onLogStateChange(false,user);
        // console.log(user);
        localStorage.setItem('isLoggedIn', 'true');
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
    <div className="mlogin">
      <div className="container mt-3 d-flex flex-column align-items-center">
        <h2>Login</h2>
        <form onSubmit={loginUser} className='login col-md-5'>
            <div className="form-group  mb-3">
              <label htmlFor="email"><i className="fa-solid fa-envelope"></i> Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                autoComplete="off"
                value={email}
                name="email"
                onChange={(e)=>setEmail(e.target.value)}
                required 
                />
            </div>
        
            <div className="form-group  mb-3">
              <label htmlFor="password"><i className="fa-solid fa-lock"></i> Password</label>
              <div className="input-box">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  autoComplete="off"
                  value={password}
                  name="password"
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                />
                <span className="eye" onClick={hide}>
                  <i id="hideeye1" className="fa-regular fa-eye"></i>
                  <i id="hideeye2" className="fa-regular fa-eye-slash"></i>
                </span>
              </div>
            </div>
            <div id="wrongpassword" style={{color: "black", paddingBottom:".7rem"}}>
            
            </div>
            <div className='d-flex justify-content-between'>
              <button type="submit" className="signbtn">
                Login
              </button>
              <NavLink to="/signup" className="already"> Need an account?</NavLink>
            </div>
            <div className="line-container">
              <span className="text-between">or</span>
            </div>
            <div className="sociallog">
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              className="col-md-6">
                <GoogleLogin className="btn bg-dark"
                  onSuccess={(credentialResponse) => {
                    const decoded = jwtDecode(credentialResponse.credential);
                    const googleEmail = decoded.email; 

                    sendGoogleLogInInfo(googleEmail);
                    // console.log(decoded);
                    // console.log(googleEmail);
                  }}
                  style={{backgroundColor: "green", width: "5rem"}}
                  onFailure={(error) => {
                    console.error(error);
                  }}
                >
                  <span>Log in with Google</span>
                </GoogleLogin>
              </GoogleOAuthProvider>
            </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default Login
