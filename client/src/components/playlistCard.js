import React from "react";
import { useDispatch } from 'react-redux';
import { setSelectedPlaylist } from '../redux/features/songSlice';

const PlaylistCard = ({
  playlist,
  setDisplaySongs,
  setSelectedPlaylistData,
  fetchSelectedPlaylistSongs
}) => {
  const dispatch = useDispatch();

  const handlePlaylistSelect = () => {
    dispatch(setSelectedPlaylist({
      id: playlist.id,
      name: playlist.name
    }));
    setDisplaySongs(true);
    setSelectedPlaylistData(playlist);
    fetchSelectedPlaylistSongs(playlist.name);
  };

  return (
    <div
      className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md m-2 p-3 w-48 h-64 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      onClick={handlePlaylistSelect}
    >
      <div className="w-full flex justify-center min-h-24">
        <img
          loading="lazy"
          src={playlist.images[0]?.url}
          className="rounded-lg object-cover w-full h-full"
          alt={playlist.name}
        />
      </div>
      <div className="mt-2 text-center flex-1 flex items-center justify-center w-full">
        <p className="font-semibold text-sm truncate max-w-[10rem]">
          {playlist.name} - {playlist.owner.display_name}
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;