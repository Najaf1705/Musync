import React from 'react';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import {Route,Routes} from "react-router-dom";
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
import Errorpage from './components/Errorpage';
import Playlists from './components/Playlists';
// const dotenv = require("dotenv");
// dotenv.config({path:'../clientconfig.env'});

const App = () => {
  const [selectedSong, setSelectedSong] = useState('');
  // const [userName, setUserName] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [login, setLogin] = useState(localStorage.getItem('isLoggedIn'));
  const handleSelectedSongChange = (songDetails) => {
    setSelectedSong(songDetails);
  };
  const logChange = (logstate,userDets) => {
    if(logstate){
      setLogin(false);
      setUserDetails({});
      // console.log(userDetails);
    }
    else{
      setLogin(true);
      setUserDetails(userDets);
      // console.log(userDetails);
    }
  };

  const updateUserDetails = (newUserDetails) => {
    setUserDetails(newUserDetails);
  };

  return (
    <>
      <Navbar login={login} onLogStateChange={logChange} userDetails={userDetails} />
        <Routes>
          <Route path="" element={<Home login={login} selectedSong={selectedSong} updateUserDetails={updateUserDetails} 
          onSelectedSongChange={handleSelectedSongChange} userDetails={userDetails} />}>
            
          </Route>
          <Route path="/discover" element={<Discover selectedSong={selectedSong} 
          onSelectedSongChange={handleSelectedSongChange}/>} />
          <Route path="/download" element={<Download selectedSong={selectedSong}/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login  onLogStateChange={logChange} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/playlists" element={<Playlists userDetails={userDetails} />} />
          <Route path="*" element={<Errorpage />} />
        </Routes>
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
