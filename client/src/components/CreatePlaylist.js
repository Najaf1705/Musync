import React, {useEffect, useState} from 'react'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../redux/features/userSlice';

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
        toast.error(`${playlistName} already exists, choose another name`);
      } else {
        const newPlaylist = await response.json();
  
        const updatedUserDetails = {
          ...userDetails,
          playlists: [...userDetails.playlists, newPlaylist],
        };
  
        dispatch(setUserDetails(updatedUserDetails));
        console.log(updatedUserDetails.playlists);
        toast.success(`Playlist ${playlistName} created successfully`);
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
      <div className='modal-wrapper'></div>
      <div className='modal-container px-2' onClick={closeModal}>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
          <div>
            <h2>Create playlist</h2>
          </div>
          <div className='d-flex flex-column align-items-center'>
            <div>
              <input type="text"
              placeholder='Enter playlist name'
              value={playlistName}
              required
              onChange={(e)=>setPlaylistName(e.target.value)}
              style={{height: "2rem"}}
              />
            </div>
            <div className='pt-2 d-flex justify-content-between'>
              <button className='mx-2' onClick={handleCreate}>Create</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreatePlaylist
