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
// import Playlists from './components/Playlists';
// const dotenv = require("dotenv");
// dotenv.config({path:'../clientconfig.env'});

const App = () => {
  const [selectedSong, setSelectedSong] = useState('');
  const [userName, setUserName] = useState('');
  const [login, setLogin] = useState(false);
  const handleSelectedSongChange = (songDetails) => {
    setSelectedSong(songDetails);
  };
  const logChange = (logstate,name) => {
    if(logstate){
      setLogin(false);
      setUserName("");
    }
    else{
      setLogin(true);
      setUserName(name.split(' ')[0]);
    }
  };

  return (
    <>
    <Navbar login={login} onLogStateChange={logChange} />
      <Routes>
        <Route path="" element={<Home selectedSong={selectedSong} 
        onSelectedSongChange={handleSelectedSongChange} userName={userName} />}>
          
        </Route>
        <Route path="/discover" element={<Discover selectedSong={selectedSong} 
        onSelectedSongChange={handleSelectedSongChange}/>} />
        <Route path="/download" element={<Download selectedSong={selectedSong}/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login  onLogStateChange={logChange} />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/playlists" element={<Playlists />} /> */}
        <Route path="*" element={<Errorpage />} />
      </Routes>
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
