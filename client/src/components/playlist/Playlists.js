import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { showInfoToast, showErrorToast } from "../utils/toast";
import PlaylistCard from "../common/playlistCard";
import PlaylistDetail from "./playlistDetail";
import { createPlaylistThunk, deletePlaylistThunk } from "../../redux/features/song/songThunks";
import CreatePlaylistModal from "../common/CreatePlaylistModal";
import { useDisclosure } from "@heroui/react";
import { fetchTrackDetails } from "../utils/api";

const Playlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { playlistId } = useParams();

  const {isAuthLoading, isAuthenticated, user} = useSelector((state) => state.auth);
  const userPlaylists = useSelector((state) => Array.isArray(state.songs.userPlaylists) ? state.songs.userPlaylists : []);
  const visiblePlaylists = useMemo(() => {
    const likedPlaylist = userPlaylists.find((playlist) => playlist.playlistName === 'Liked Songs');

    return [
      likedPlaylist || { playlistName: 'Liked Songs', songs: [], _id: 'likedSongs' },
      ...userPlaylists.filter((playlist) => playlist.playlistName !== 'Liked Songs')
    ];
  }, [userPlaylists]);

  const [loading, setLoading] = useState(false);
  const [displaySongs, setDisplaySongs] = useState(Boolean(playlistId));
  const [selectedPlaylistSongsData, setSelectedPlaylistSongsData] = useState([]);
  const [selectedPlaylistData, setSelectedPlaylistData] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/', {replace: true});
      showInfoToast("Log in to see your playlists");
    }
  }, [isAuthLoading, isAuthenticated, navigate, userPlaylists]);

  const fetchSelectedPlaylistSongs = useCallback(async (pnameOrId) => {
    const selectedPlaylist = visiblePlaylists.find((playlist) => {
      const playlistLookup = playlist.playlistName || playlist.name || playlist._id || playlist.id;
      return playlistLookup === pnameOrId || String(playlist._id || playlist.id) === String(pnameOrId);
    }) || null;

    setSelectedPlaylistSongsData([]);
    const songIds = Array.isArray(selectedPlaylist?.songs) ? selectedPlaylist.songs.filter(Boolean).map((song) => String(song).trim()) : [];

    if (!songIds.length) return;

    try {
      setLoading(true);
      const promises = songIds.map(async (song) => await fetchTrackDetails(song));
      const allSongDetails = await Promise.all(promises);
      setSelectedPlaylistSongsData(allSongDetails.filter(Boolean));
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  }, [visiblePlaylists]);

  useEffect(() => {
    if (!playlistId) return;

    const selectedPlaylist = visiblePlaylists.find((playlist) => {
      const id = playlist._id || playlist.id || playlist.playlistName;
      return String(id) === decodeURIComponent(playlistId);
    });

    if (selectedPlaylist) {
      setSelectedPlaylistData(selectedPlaylist);
      setDisplaySongs(true);
      fetchSelectedPlaylistSongs(selectedPlaylist.playlistName || selectedPlaylist.name || selectedPlaylist._id || selectedPlaylist.id);
    }
  }, [playlistId, visiblePlaylists, fetchSelectedPlaylistSongs]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="home">
      <div className="mx-4">
        {!displaySongs ? (
          <>
            <h2 className="my-6 text-2xl font-semibold">Your playlists</h2>
            <div className="flex flex-wrap items-center justify-center mx-1">
              {visiblePlaylists.length === 0 ? (
                <div className="mt-8 text-gray-400">No playlists yet. Create one to get started.</div>
              ) : (
                visiblePlaylists.map((playlist, index) => (
                  <PlaylistCard
                    key={playlist._id || playlist.id || index}
                    playlist={{
                      ...playlist,
                      id: playlist._id || playlist.id,
                      name: playlist.playlistName,
                      image: "/images/playlists.png",
                      owner: { display_name: "You" }
                    }}
                    parentComponent="playlist"
                    deletePlaylist={()=>dispatch(deletePlaylistThunk({ playlistName: playlist.playlistName}))}
                    setDisplaySongs={setDisplaySongs}
                    setSelectedPlaylistData={setSelectedPlaylistData}
                    fetchSelectedPlaylistSongs={fetchSelectedPlaylistSongs}
                  />
                ))
              )}

              {/* ➕ Create Playlist */}
              <div
                className="flex flex-col w-36 h-48 sm:w-48 sm:h-64 items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md m-2 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={onOpen}
              >
                <div className="flex flex-col items-center justify-center mt-1">
                  <i className="fa-solid fa-circle-plus fa-5x text-blue-500 hover:text-blue-700 transition"></i>
                  <h4 className="text-center mt-2">Create playlist</h4>
                </div>
              </div>
            </div>
          </>
        ) : (
          <PlaylistDetail
            selectedPlaylistData={selectedPlaylistData}
            setDisplaySongs={setDisplaySongs}
            selectedPlaylistSongsData={selectedPlaylistSongsData}
            loading={loading}
          />
        )}
      </div>

      <CreatePlaylistModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        newPlaylistName={playlistName}
        setNewPlaylistName={setPlaylistName}
        onCreate={(onClose) => {
          if (!playlistName.trim()) return;
          if (visiblePlaylists.some(p => p.playlistName.trim().toLowerCase() === playlistName.trim().toLowerCase())) {
            showErrorToast("Playlist with this name already exists.");
            return;
          }
          dispatch(createPlaylistThunk({ playlistName: playlistName.trim()}));
          setPlaylistName('');
          onClose();
        }}
      />
    </div>
  );
};

export default Playlist;
