import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import SearchBar from "./searchBar";
import RecentSearches from "./recentSearches";
import SearchResults from "./searchResults";
import TopSongs from "./topSongs";
import CreatePlaylist from "../CreatePlaylist";
import { fetchTopSongs, fetchPlaylistTracks, searchSongsAndPlaylists } from "../utils/api";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [songName, setSongName] = useState("");
  const [songData, setSongData] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [likedSongs, setLikedSongs] = useState(userDetails?.likedSongs || []);
  const [loading, setLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [topSongs, setTopSongs] = useState(null);
  const [cardColors, setCardColors] = useState([]);
  const [cardTextColors, setCardTextColors] = useState([]);

  // Fetch top songs
  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      const data = await fetchTopSongs();
      setTopSongs(data);
      setLoading(false);
    };
    fetchSongs();
  }, []);

  // Fetch playlist tracks
  useEffect(() => {
    if (selectedPlaylist) {
      const fetchTracks = async () => {
        setLoading(true);
        const data = await fetchPlaylistTracks(selectedPlaylist);
        setPlaylistTracks(data.items);
        setLoading(false);
      };
      fetchTracks();
    } else {
      setPlaylistTracks([]);
    }
  }, [selectedPlaylist]);

  // Search songs and playlists
  const searchSong = useCallback(async () => {
    setLoading(true);
    const { songs, playlists } = await searchSongsAndPlaylists(songName);
    setSongData(songs);
    setPlaylistData(playlists);
    setLoading(false);
  }, [songName]);

  useEffect(() => {
    searchSong();
  }, [songName, searchSong]);

  // Handle recent searches
  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  const saveRecentSearchesToLocalStorage = (searches) => {
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (songName.trim() !== "" && !recentSearches.includes(songName)) {
      const updatedSearches = [songName, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedSearches);
      saveRecentSearchesToLocalStorage(updatedSearches);
    }
  };

  const handleRemoveRecent = (removedItem) => {
    const updatedSearches = recentSearches.filter((item) => item !== removedItem);
    setRecentSearches(updatedSearches);
    saveRecentSearchesToLocalStorage(updatedSearches);
  };

  return (
    <div className="home pb-3">
      <div className="mx-2">
        <h3>Ohiyooo {userDetails?.name?.split(" ")[0] || "Luffy"}</h3>
        <SearchBar
          songName={songName}
          setSongName={setSongName}
          handleSubmit={handleSubmit}
        />
        <RecentSearches
          recentSearches={recentSearches}
          handleRemoveRecent={handleRemoveRecent}
          setSongName={setSongName}
        />
        <SearchResults
          songData={songData}
          playlistData={playlistData}
          selectedPlaylist={selectedPlaylist}
          setSelectedPlaylist={setSelectedPlaylist}
          setSelectedPlaylistName={setSelectedPlaylistName}
          playlistTracks={playlistTracks}
          // handleDownload={onSelectedSongChange}
          likedSongs={likedSongs}
          setLikedSongs={setLikedSongs}
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