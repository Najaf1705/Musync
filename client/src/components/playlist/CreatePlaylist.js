import React, {useEffect, useState} from 'react'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/features/userSlice';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const CreatePlaylist = ({ playlistModal }) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const [playlistName, setPlaylistName] = useState('');

  const handleCreate = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create-playlist/${playlistName.trim()}/${userDetails._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        showErrorToast(`${playlistName} already exists, choose another name`);
      } else {
        const newPlaylist = await response.json();
  
        const updatedUserDetails = {
          ...userDetails,
          playlists: [...userDetails.playlists, newPlaylist],
        };
  
        dispatch(setUser(updatedUserDetails));
        console.log(updatedUserDetails.playlists);
        showSuccessToast(`Playlist ${playlistName} created successfully`);
        playlistModal(false);
      }
    } catch (error) {
      console.error('Can\'t create playlist', error);
    }
  };

  const closeModal=()=>{
    playlistModal(false);
  }

  useEffect(()=>{
    document.body.style.overflowY="hidden";
    return ()=>{document.body.style.overflowY="scroll";};
  },[])
  

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 px-2" onClick={closeModal}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div>
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">Create playlist</h2>
          </div>
          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter playlist name"
              value={playlistName}
              required
              onChange={(e)=>setPlaylistName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{height: "2rem"}}
            />
            <div className="pt-4 flex justify-between w-full">
              <button
                className="mx-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition"
                onClick={handleCreate}
              >
                Create
              </button>
              <button
                className="mx-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded transition"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreatePlaylist
