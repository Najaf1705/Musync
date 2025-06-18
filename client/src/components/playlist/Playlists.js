import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreatePlaylist from "./CreatePlaylist";
import SongCard from "../songCard";
import PlaylistCard from "../playlistCard";
import PlaylistDetail from "./playlistDetail"; // <-- Import the PlaylistDetail component
import { toast } from 'react-toastify';


const Playlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const likedSongs = useSelector((state) => state.songs.likedSongs);
  const userPlaylists = useSelector((state) => state.songs.userPlaylists);

  const [loading, setLoading] = useState(false);
  const [displaySongs, setDisplaySongs] = useState(false);
  const [likedSongsData, setLikedSongsData] = useState([]);
  const [selectedPlaylistSongsData, setSelectedPlaylistSongsData] = useState([]);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [selectedPlaylistData, setSelectedPlaylistData] = useState(null);

  useEffect(() => {  
    if(!isLoggedIn){
      navigate('/');
      toast.info("Log in to see your playlists");
      return;
    }
  }, [isLoggedIn])
  


  const fetchSelectedPlaylistSongs = async (pname) => {
    const selectedPlaylist = userPlaylists.find(
      (playlist) => playlist.playlistName === pname
    );

    setSelectedPlaylistSongsData([]);

    if (!selectedPlaylist?.songs?.length) return;

    try {
      setLoading(true);
      const promises = selectedPlaylist.songs.map(async (song) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/${song}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch song details for ID: ${song}`);
        }
        return await response.json();
      });

      const allSongDetails = await Promise.all(promises);
      setSelectedPlaylistSongsData(allSongDetails);
    } catch (error) {
      console.error("Error fetching song details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <div className="mx-4">
        {displaySongs === false ? (
          // playlist cards
          <>
            <h2 className="my-6 text-2xl font-semibold">
              Your playlists
            </h2>
            <div className="flex flex-wrap justify-center mx-1">
              {userPlaylists.map((playlist, index) => 
              // {
                (
                <PlaylistCard
                  playlist={{
                    ...playlist,
                    id: playlist._id || playlist.id,
                    name: playlist.playlistName, // use playlistName as name
                    images: [{ url: "/images/playlists.png" }],
                    owner: { display_name: "You" }
                  }}
                  parentComponent="playlist"
                  setDisplaySongs={setDisplaySongs}
                  setSelectedPlaylistData={setSelectedPlaylistData}
                  fetchSelectedPlaylistSongs={fetchSelectedPlaylistSongs}
                  key={playlist._id || playlist.id || index}
                />
              )
              // console.log("playlist Playlist:", playlist);
            // }
              )}
              {/* Create Playlist Card */}
              <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md m-2 p-3 w-64 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <div className="flex flex-col items-center justify-center mt-1">
                  <i
                    className="fa-solid fa-circle-plus fa-5x text-blue-500 hover:text-blue-700 transition"
                    onClick={() => setPlaylistModal(true)}
                  ></i>
                  <h4 className="text-center mt-2">Create playlist</h4>
                </div>
              </div>
            </div>
          </>
        ) : (
          // playlist songs
          <PlaylistDetail
            selectedPlaylistData={selectedPlaylistData}
            setDisplaySongs={setDisplaySongs}
            selectedPlaylistSongsData={selectedPlaylistSongsData}
            loading={loading}
          />
        )}
        {/* </div> */}
      </div>
      {playlistModal && (
        <CreatePlaylist playlistModal={setPlaylistModal} />
      )}
    </div>
  );
};

export default Playlist;