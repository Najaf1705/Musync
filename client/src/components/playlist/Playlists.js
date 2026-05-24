import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showInfoToast, showSuccessToast, showErrorToast } from "../utils/toast";
import PlaylistCard from "../common/playlistCard";
import PlaylistDetail from "./playlistDetail";
import { createPlaylistThunk, deletePlaylistThunk } from "../../redux/features/song/songThunks";
import CreatePlaylistModal from "../common/CreatePlaylistModal";
import { useDisclosure } from "@heroui/react";
import { fetchTrackDetails } from "../utils/api";

const Playlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAuthReady = useSelector((state) => state.user.isAuthReady);
  const userPlaylists = useSelector((state) => state.songs.userPlaylists);

  const [loading, setLoading] = useState(false);
  const [displaySongs, setDisplaySongs] = useState(false);
  const [selectedPlaylistSongsData, setSelectedPlaylistSongsData] = useState([]);
  const [selectedPlaylistData, setSelectedPlaylistData] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isLoggedIn) {
      navigate('/', {replace: true});
      showInfoToast("Log in to see your playlists");
    }
  }, [isLoggedIn, isAuthReady, navigate]);

  const fetchSelectedPlaylistSongs = async (pname) => {
    const selectedPlaylist = userPlaylists.find((playlist) => playlist.playlistName === pname);
    setSelectedPlaylistSongsData([]);

    if (!selectedPlaylist?.songs?.length) return;

    try {
      setLoading(true);
      const promises = selectedPlaylist.songs.map(async (song) => {
        return await fetchTrackDetails(song);
      });

      const allSongDetails = await Promise.all(promises);
      setSelectedPlaylistSongsData(allSongDetails);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userDetails) return <div>Loading...</div>;

  return (
    <div className="home">
      <div className="mx-4">
        {!displaySongs ? (
          <>
            <h2 className="my-6 text-2xl font-semibold">Your playlists</h2>
            <div className="flex flex-wrap items-center justify-center mx-1">
              {userPlaylists.map((playlist, index) => (
                <PlaylistCard
                  key={playlist._id || playlist.id || index}
                  playlist={{
                    ...playlist,
                    id: playlist._id || playlist.id,
                    name: playlist.playlistName,
                    images: [{},{},{ url: "/images/playlists.png" }],
                    owner: { display_name: "You" }
                  }}
                  parentComponent="playlist"
                  deletePlaylist={()=>dispatch(deletePlaylistThunk({ playlistName: playlist.playlistName}))}
                  setDisplaySongs={setDisplaySongs}
                  setSelectedPlaylistData={setSelectedPlaylistData}
                  fetchSelectedPlaylistSongs={fetchSelectedPlaylistSongs}
                />
              ))}

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
          if (userPlaylists.some(p => p.playlistName.trim().toLowerCase() === playlistName.trim().toLowerCase())) {
            showErrorToast("Playlist with this name already exists.");
            return;
          }
          dispatch(createPlaylistThunk({ playlistName: playlistName.trim(), userId: userDetails._id }));
          setPlaylistName('');
          onClose();
        }}
      />
    </div>
  );
};

export default Playlist;
