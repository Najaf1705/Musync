import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import SearchBar from "../common/searchBar";
import RecentSearches from "./recentSearches";
import SearchResults from "./searchResults";
import TopSongs from "./topSongs";
import { fetchPlaylistTracks } from "../utils/api";
import { searchSongsAndPlaylistsThunk } from '../../redux/features/song/songThunks';
import { showErrorToast } from "../utils/toast";


const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.user);
  const likedSongs = useSelector((state) => state.songs.likedSongs);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const topSongs = useSelector((state) => state.songs.topSongs);

  const [songName, setSongName] = useState("");
  const [songData, setSongData] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [cardColors, setCardColors] = useState([]);
  const [cardTextColors, setCardTextColors] = useState([]);
  const [displayPlaylistSongs, setDisplayPlaylistSongs] = useState(false);


  // Fetch playlist tracks
  useEffect(() => {
    if (selectedPlaylist) {
      const fetchTracks = async () => {
        // setLoading(true);
        const data = await fetchPlaylistTracks(selectedPlaylist);
        setPlaylistTracks(data.items);
        // setLoading(false);
      };
      fetchTracks();
    } else {
      setPlaylistTracks([]);
    }
  }, [selectedPlaylist]);


  // Handle recent searches
  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearchesToLocalStorage = (searches) => {
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  };


  // search a song and update recent searches
  const handleSubmit = async (e, value) => {
    if (e) e.preventDefault();
    setDisplayPlaylistSongs(false);
    const trimmedSongName = (value ?? songName).trim();

    if (!trimmedSongName) {
      showErrorToast('Please enter a song name');
      return;
    }

    try {
      // Update recent searches
      if (!recentSearches.includes(trimmedSongName)) {
        const updatedSearches = [trimmedSongName, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedSearches);
        saveRecentSearchesToLocalStorage(updatedSearches);
      }

      // Perform search
      await dispatch(searchSongsAndPlaylistsThunk(trimmedSongName)).unwrap();
    } catch (error) {
      showErrorToast('Failed to search songs');
    }
  };
  

  const handleRemoveRecent = (removedItem) => {
    const updatedSearches = recentSearches.filter((item) => item !== removedItem);
    setRecentSearches(updatedSearches);
    saveRecentSearchesToLocalStorage(updatedSearches);
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="pb-6">
      <div className="mx-4">
        <h3 className="text-2xl font-semibold mb-4">
          {getGreeting()} {userDetails?.name?.split(" ")[0] || "Luffy"}
        </h3>
        <SearchBar
          songName={songName}
          setSongName={setSongName}
          handleSubmit={handleSubmit}
        />
        <RecentSearches
          recentSearches={recentSearches}
          handleRemoveRecent={handleRemoveRecent}
          setSongName={setSongName}
          handleSubmit={handleSubmit}
        />
        <SearchResults
          songData={songData}
          playlistData={playlistData}
          selectedPlaylist={selectedPlaylist}
          setSelectedPlaylist={setSelectedPlaylist}
          setSelectedPlaylistName={setSelectedPlaylistName}
          playlistTracks={playlistTracks}
          setSongName={setSongName}
          cardColors={cardColors}
          cardTextColors={cardTextColors}
          setCardColors={setCardColors}
          setCardTextColors={setCardTextColors}
          loading={loading}
          playlists={userDetails?.playlists}
          setPlaylistModal={setPlaylistModal}
          login={isLoggedIn}
          displayPlaylistSongs={displayPlaylistSongs}
          setDisplayPlaylistSongs={setDisplayPlaylistSongs}
        />
        <TopSongs
          topSongs={topSongs}
          loading={loading}
          // setLoading={setLoading}
        />
        {/* {playlistModal && (
          <CreatePlaylist
            playlistModal={setPlaylistModal}
          />
        )} */}
      </div>
      <Outlet />
    </div>
  );
};

export default Home;