import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import Navbar from './components/Navbar';
import Home from './components/home/Home.js';
import Discover from './components/Discover';
import Download from './components/download/Download';
import Profile from './components/Profile';
import Login from './components/auth/Login.js';
import Signup from './components/auth/Signup.js';
import Errorpage from './components/Errorpage';
import Playlists from './components/playlist/Playlists';
import { fetchTopSongs, setUserPlaylists, setUserSongs } from './redux/features/songSlice'; // adjust path as needed
import { fetchLikedSongs, setLikedSongs, clearSongSlice } from './redux/features/songSlice'; // adjust path as needed
import { setUser, clearUser } from './redux/features/userSlice'; // adjust path as needed

const App = () => {
  const [selectedSong, setSelectedSong] = useState('');
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userDetails = useSelector((state) => state.user.user);
  const likedSongsId = useSelector((state) => state.songs.likedSongs);
  // dispatch(fetchLikedSongs(userDetails._id));

  useEffect(() => {
    console.log("User Details:", userDetails);
    console.log("Liked sonsgs:", likedSongsId);

    dispatch(fetchTopSongs());
  }, [userDetails]);

  useEffect(() => {
    dispatch(fetchTopSongs());
  }, [dispatch]);


  const handleSelectedSongChange = (songDetails) => {
    setSelectedSong(songDetails);
  };

  useEffect(() => {
    console.log(process.env.REACT_APP_BACKEND_URL);
    const verify = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/serverprofile`, {
        method: "GET",
        credentials: "include",
      });


      if (res.ok) {
        const user = await res.json();
        console.log("serverprofile response", user);
        dispatch(setUser(user)); // refresh with real data
        dispatch(setUserSongs({ likedSongs: user.likedSongs, userPlaylists: user.playlists })); // set liked songs
        // console.log("likedSongs:", user.likedSongs);
      } else {
        dispatch(clearUser());
        dispatch(clearSongSlice());
      }
    };

    verify();
  }, []);

  // console.log("user Song slice",useSelector((state)=>state.songs));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div
        className="flex-1 text-white pt-16 pb-6"
        style={{
          // backgroundImage: "url('/gbg.png')"
        }}
      >
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
      <footer className="text-center text-sm font-medium bg-gray-900 text-white">
        © {new Date().getFullYear()}{" "}
        <span className="text-green-600 cursor-pointer hover:underline"
          onClick={() => window.open("https://github.com/Najaf1705", "_blank")}
          title="Visit Najaf's GitHub Profile" aria-label="Najaf's GitHub Profile"
        >
          {`Najaf`}
        </span>
        {` All rights reserved.`}
      </footer>
      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default App