import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from "react-router-dom";
import Login from './components/auth/Login.js';
import Signup from './components/auth/Signup.js';
import Otp from './components/auth/Otp.js';
import Password from './components/auth/Password.js';
import Setpassword from './components/auth/Setpassword.js';
import Navbar from './components/common/Navbar.js';
import Discover from './components/Discover';
import Download from './components/download/Download';
import Errorpage from './components/Errorpage';
import Home from './components/home/Home.js';
import Playlists from './components/playlist/Playlists';
import Profile from './components/Profile';
import "./index.css";
import { clearSongSliceThunk, fetchTopSongsThunk, setUserSongsThunk } from './redux/features/song/songThunks.js'; // adjust path as needed
import GoogleOneTapLogin from './components/auth/GoogleOneTapLogin.js';
import { fetchCurrentUser } from './redux/features/auth/authThunks.js';
import { logout, setAuthLoading } from './redux/features/auth/authSlice.js';

const App = () => {
  const [selectedSong, setSelectedSong] = useState('');
  const dispatch = useDispatch();
  const isAuthLoading = useSelector((state) => state.auth.isAuthLoading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(fetchTopSongsThunk());
  }, [dispatch]);

  const handleSelectedSongChange = (songDetails) => {
    setSelectedSong(songDetails);
  };

useEffect(() => {
    const bootstrap = async () => {
      dispatch(setAuthLoading(true));
      try {
        await dispatch(fetchCurrentUser()).unwrap();
        
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    bootstrap();
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthLoading && !isAuthenticated && <GoogleOneTapLogin />}
      <Toaster position="bottom-center" limit={5} />
      <Navbar />
      <div className="flex-1 text-white pt-16 pb-6">
        <Routes>
          <Route path="" element={
            <Home
              selectedSong={selectedSong}
              onSelectedSongChange={handleSelectedSongChange}
            />
          } />
          <Route path="/discover" element={
            <Discover
              selectedSong={selectedSong}
              onSelectedSongChange={handleSelectedSongChange}
            />
          } />
          <Route path="/download" element={<Download selectedSong={selectedSong} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/otp" element={<Otp />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/login/password" element={<Password />} />
          <Route path="/setpassword" element={<Setpassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlist/:playlistId" element={<Playlists />} />
          <Route path="*" element={<Errorpage />} />
        </Routes>
      </div>
      <footer className="text-center text-sm font-medium text-white">
        © {new Date().getFullYear()}{" "}
        <span className="text-green-600 cursor-pointer hover:underline"
          onClick={() => window.open("https://najaf.vercel.app", "_blank")}
          title="Visit Najaf's GitHub Profile" aria-label="Najaf's GitHub Profile"
        >
          {`Najaf`}
        </span>
        {` All rights reserved. `}
        <a href="https://najaf.in/privacy-policy" target="_blank" rel="noopener noreferrer"
          className='text-purple-300'
        >Privacy Policy</a>
      </footer>
    </div>
  )
}

export default App