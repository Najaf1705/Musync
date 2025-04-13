import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from './redux/features/userSlice';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import "./main.js";
import Navbar from './components/Navbar';
import Home from './components/home/Home.js';
import Discover from './components/Discover';
import Download from './components/download/Download';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import Errorpage from './components/Errorpage';
import Playlists from './components/Playlists';

const App = () => {
  const [selectedSong, setSelectedSong] = useState('');
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userDetails = useSelector((state) => state.user.userDetails);

  useEffect(() => {
    dispatch(fetchUserDetails())
      .unwrap()
      .then((data) => {
        console.log('User details fetched successfully:', data);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }, [dispatch]);

  const handleSelectedSongChange = (songDetails) => {
    setSelectedSong(songDetails);
  };

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
