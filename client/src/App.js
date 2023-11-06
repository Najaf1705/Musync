import React from 'react';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import "./main.js";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Discover from './components/Discover';
import Download from './components/Download';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import {Route,Routes} from "react-router-dom";
import Errorpage from './components/Errorpage';
// const dotenv = require("dotenv");
// dotenv.config({path:'../clientconfig.env'});

const App = () => {
  const [selectedSong, setSelectedSong] = useState('');
  const [login, setLogin] = useState(false);
  const handleSelectedSongChange = (songDetails) => {
    setSelectedSong(songDetails);
  };
  const logChange = (logstate) => {
    logstate?setLogin(false):setLogin(true)
  };

  return (
    <>
    <Navbar login={login} onLogStateChange={logChange} />
      <Routes>
        <Route path="" element={<Home selectedSong={selectedSong} 
        onSelectedSongChange={handleSelectedSongChange} />}>
          
        </Route>
        <Route path="/discover" element={<Discover selectedSong={selectedSong} 
        onSelectedSongChange={handleSelectedSongChange}/>} />
        <Route path="/download" element={<Download selectedSong={selectedSong}/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login  onLogStateChange={logChange} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Errorpage />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
