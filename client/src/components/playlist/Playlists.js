import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showInfoToast, showSuccessToast, showErrorToast } from "../utils/toast";
import PlaylistCard from "../common/playlistCard";
import PlaylistDetail from "./playlistDetail";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

import { createPlaylist } from "../../redux/features/songSlice";

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

  const [playlistName, setPlaylistName] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isLoggedIn) {
      navigate('/');
      showInfoToast("Log in to see your playlists");
    }
  }, [isLoggedIn, isAuthReady]);

  const fetchSelectedPlaylistSongs = async (pname) => {
    const selectedPlaylist = userPlaylists.find((playlist) => playlist.playlistName === pname);
    setSelectedPlaylistSongsData([]);

    if (!selectedPlaylist?.songs?.length) return;

    try {
      setLoading(true);
      const promises = selectedPlaylist.songs.map(async (song) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/${song}`);
        if (!response.ok) throw new Error(`Failed to fetch song ID: ${song}`);
        return await response.json();
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
                    images: [{ url: "/images/playlists.png" }],
                    owner: { display_name: "You" }
                  }}
                  parentComponent="playlist"
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

      {/* ✅ Modal for Create Playlist */}
      <Modal
        backdrop="opaque"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: "py-6",
          backdrop: "bg-black/80 backdrop-opacity-40",
          base: "border-[#1f1f1f] bg-[#121212] text-[#e0e0e0]",
          closeButton: "hover:bg-white/5 active:bg-white/10 top-2 right-2",
        }}
      >
        <ModalContent>
          {(onCloseModal) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!playlistName.trim()) return;
                showSuccessToast("Playlist created successfully!");
                dispatch(createPlaylist({ playlistName: playlistName.trim(), userId: userDetails._id }));
                setPlaylistName('');
                onCloseModal(); // ✅ properly close modal
              }}
            >
              <ModalHeader className="text-white font-semibold text-xl pt-4 pb-0">
                Create New Playlist
              </ModalHeader>
              <ModalBody>
                <input
                  type="text"
                  value={playlistName}
                  required
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter playlist name"
                  autoFocus
                />
              </ModalBody>
              <ModalFooter className="flex justify-end items-center gap-4 p-4">
                <Button onPress={onCloseModal}>Cancel</Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2"
                >
                  Create
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Playlist;
