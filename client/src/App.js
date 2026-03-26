import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Route, Routes } from "react-router-dom";
import Login from './components/auth/Login.js';
import Signup from './components/auth/Signup.js';
import Navbar from './components/common/Navbar.js';
import Discover from './components/Discover';
import Download from './components/download/Download';
import Errorpage from './components/Errorpage';
import Home from './components/home/Home.js';
import Playlists from './components/playlist/Playlists';
import Profile from './components/Profile';
import "./index.css";
import { clearSongSliceThunk, fetchTopSongsThunk, setUserSongsThunk } from './redux/features/song/songThunks.js'; // adjust path as needed
import { clearUser, setAuthReady, setUser } from './redux/features/userSlice'; // adjust path as needed

const App = () => {
  const [selectedSong, setSelectedSong] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTopSongsThunk());
  }, [dispatch]);

  const handleSelectedSongChange = (songDetails) => {
    setSelectedSong(songDetails);
  };

  useEffect(() => {
    console.log(process.env.REACT_APP_BACKEND_URL);
    const verify = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/serverprofile`, {
        method: "GET",
        credentials: "include",
      });


      if (res.ok) {
        const user = await res.json();
        // console.log("serverprofile response", user);
        dispatch(setUser(user));
        dispatch(setUserSongsThunk({ likedSongs: user.likedSongs, userPlaylists: user.playlists })); // set liked songs
      } else {
        dispatch(clearUser());
        dispatch(clearSongSliceThunk());
      }
      dispatch(setAuthReady(true));
    };

    verify();
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
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
          <Route path="/signup" element={<Signup />} />
          <Route path="/playlists" element={<Playlists />} />
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