import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import SearchBar from "./searchBar";
import RecentSearches from "./recentSearches";
import SearchResults from "./searchResults";
import TopSongs from "./topSongs";
import CreatePlaylist from "../playlist/CreatePlaylist";
import { fetchTopSongs, fetchPlaylistTracks } from "../utils/api";
import { searchSongsAndPlaylists } from '../../redux/features/songSlice';


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

  // Search songs and playlists
  const searchSong = useCallback(async () => {
    // setLoading(true);
    const { songs, playlists } = await searchSongsAndPlaylists(songName);
    setSongData(songs);
    setPlaylistData(playlists);
    // setLoading(false);
  }, [songName]);

  // useEffect(() => {
  //   searchSong();
  // }, [songName, searchSong]);

  // Handle recent searches
  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  const saveRecentSearchesToLocalStorage = (searches) => {
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  };

  const handleSubmit = async (e, value) => {
    if (e) e.preventDefault();
    const trimmedSongName = (value ?? songName).trim();

    if (!trimmedSongName) {
      toast.error('Please enter a song name');
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
      await dispatch(searchSongsAndPlaylists(trimmedSongName)).unwrap();
    } catch (error) {
      toast.error('Failed to search songs');
    }
  };

  const handleRemoveRecent = (removedItem) => {
    const updatedSearches = recentSearches.filter((item) => item !== removedItem);
    setRecentSearches(updatedSearches);
    saveRecentSearchesToLocalStorage(updatedSearches);
  };

  return (
    <div className="pb-6">
      <div className="mx-4">
        <h3 className="text-2xl font-semibold mb-4">
          Ohiyooo {userDetails?.name?.split(" ")[0] || "Luffy"}
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
          // handleDownload={onSelectedSongChange}
          // likedSongs={likedSongs}
          // setLikedSongs={setLikedSongs}
          cardColors={cardColors}
          cardTextColors={cardTextColors}
          setCardColors={setCardColors}
          setCardTextColors={setCardTextColors}
          loading={loading}
          playlists={userDetails?.playlists}
          setPlaylistModal={setPlaylistModal}
          login={isLoggedIn}
        />
        <TopSongs
          topSongs={topSongs}
          cardColors={cardColors}
          cardTextColors={cardTextColors}
          setCardColors={setCardColors}
          setCardTextColors={setCardTextColors}
        />
        {playlistModal && (
          <CreatePlaylist
            playlistModal={setPlaylistModal}
          />
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default Home;