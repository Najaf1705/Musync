import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import Navbar from './components/Navbar';
import Home from './components/home/Home.js';
import Discover from './components/Discover';
import Download from './components/download/Download';
import Profile from './components/Profile';
import Login from './components/auth/Login.js';
import Signup from './components/auth/Signup.js';
import Errorpage from './components/Errorpage';
import Playlists from './components/playlist/Playlists';
import { fetchLikedSongs, setLikedSongs, clearLikeData } from './redux/features/likeSlice'; // adjust path as needed
import { setUser, clearUser } from './redux/features/userSlice'; // adjust path as needed

const App = () => {
  const [selectedSong, setSelectedSong] = useState('');
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userDetails = useSelector((state) => state.user.user);
  const likedSongsId = useSelector((state) => state.likes.likedSongs);
  // dispatch(fetchLikedSongs(userDetails._id));

  useEffect(() => {
    console.log("User Details:", userDetails);
    console.log("Liked sonsgs:", likedSongsId);
  }, [userDetails]);


  const handleSelectedSongChange = (songDetails) => {
    setSelectedSong(songDetails);
  };

  useEffect(() => {
    const verify = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/serverprofile`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const user = await res.json();
        dispatch(setUser(user)); // refresh with real data
        dispatch(setLikedSongs(user.likedSongs));
        console.log("likedSongs:", user.likedSongs);
      } else {
        dispatch(clearUser());   // localStorage token was outdated
        dispatch(clearLikeData());
      }
    };

    verify();
  }, []);


  return (
    <>
      <Navbar />
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
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
