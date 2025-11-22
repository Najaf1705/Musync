import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import SearchBar from "../common/searchBar";
import RecentSearches from "./recentSearches";
import SearchResults from "./searchResults";
import TopSongs from "./topSongs";
import { fetchPlaylistTracks } from "../utils/api";
import { searchSongsAndPlaylistsThunk } from '../../redux/features/song/songThunks';
import { showErrorToast } from "../utils/toast";


const Home = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.user);
  const topSongs = useSelector((state) => state.songs.topSongs);
  const loadingTopsongs = useSelector((state) => state.songs.topsongsLoading);

  const [songName, setSongName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
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
          {getGreeting()} {userDetails?.name
            ? userDetails.name.split(" ")[0].charAt(0).toUpperCase() + userDetails.name.split(" ")[0].slice(1).toLowerCase()
            : "Luffy"}
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
          setSongName={setSongName}
          displayPlaylistSongs={displayPlaylistSongs}
          setDisplayPlaylistSongs={setDisplayPlaylistSongs}
        />
        <TopSongs
          topSongs={topSongs}
          loadingTopsongs={loadingTopsongs}
        // setLoading={setLoading}
        />
      </div>
      <Outlet />
    </div>
  );
};

export default Home;