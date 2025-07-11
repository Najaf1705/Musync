import React, { useEffect } from 'react'
import { FiPlus } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux';
import { addSongToPlaylist } from '../../redux/features/songSlice'; // adjust path as needed


const PlaylistPopover = ({setIsPopoverOpen, songId}) => {
  const dispatch = useDispatch();
  const playlists = useSelector(state => state.songs.userPlaylists) || [];
  const userDetails = useSelector(state => state.user.user);
  // console.log("User Details in PlaylistPopover:", userDetails);
  console.log("Playlists in PlaylistPopover:", playlists);

  const addToPlaylist = (playlistId) => {
    console.log(`Adding song ${songId} to playlist ${playlistId}`);
    const selectedPlaylist=playlists.find(playlist=>playlist._id===playlistId);
    if (selectedPlaylist) {
      dispatch(addSongToPlaylist({playlistId, userId: userDetails._id, songId}));
      // setIsPopoverOpen(false);
    }
  }

  useEffect(() => {
    // This effect can be used to fetch playlists from an API or perform any setup
    console.log("PlaylistPopover mounted");
  }, []);

  return (
    <div className='bg-gray-700 p-4 rounded-md text-white min-w-36 shadow-xl shadow-gray-900/50'>
      <div className="text-sm font-medium text-white mb-2">Your Playlists</div>

      <ul className="space-y-1 max-h-40 overflow-y-auto pr-1 scrollbar">
        {playlists.map((playlist) => (
          <li
            key={playlist._id}
            className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100/10 text-sm"
            onClick={() => {
              addToPlaylist(playlist._id);
              setIsPopoverOpen(false);
            }}
          >
            {playlist.playlistName}
          </li>
        ))}
      </ul>

      <button
        className="w-full flex items-center justify-start text-sm gap-2 bg-gray-500 hover:bg-gray-100/10 px-3 py-2 mt-2 rounded-md"
        onClick={() => {console.log("Create new playlist")}}
      >
        <FiPlus className="w-4 h-4"/>
        <span>Create</span>
      </button>
    </div>
  )
}

export default PlaylistPopover
