import React, {useState} from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreatePlaylist = (props) => {

  const navigate = useNavigate();
  const [playlistName,setPlaylistName]=useState('');

  const handleCreate = async () => {
    try {
      const response = await fetch(`/api/create-playlist/${playlistName}/${props.userDetails._id}`, {
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
          ...props.userDetails,
          playlists: [...props.userDetails.playlists, newPlaylist], // Append the new playlist
        };
  
        props.updateUserDetails(updatedUserDetails);
        console.log(updatedUserDetails.playlists);
        toast.success(`Playlist ${playlistName} created successfully`);
        navigate('/playlists');
      }
    } catch (error) {
      console.error('Can\'t create playlist', error);
    }
  };
  

  return (
    <div className='popup-container'>
      <div className='popup-content'>
        <span className='close-btn'>
          &times;
        </span>
        <h2>Create playlist</h2>
        <input type="text"
        placeholder='Enter playlist name'
        value={playlistName}
        required
        onChange={(e)=>setPlaylistName(e.target.value)}
        />
        <button onClick={handleCreate}>Create</button>
      </div>
    </div>
  )
}

export default CreatePlaylist
