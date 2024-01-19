import React, {useState} from 'react'
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

const CreatePlaylist = (props) => {

  // const navigate = useNavigate();
  const [playlistName,setPlaylistName]=useState('');

  const handleCreate = async () => {
    try {
      const response = await fetch(`/api/create-playlist/${playlistName.trim()}/${props.userDetails._id}`, {
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
        // navigate('/playlists');
        props.playlistModal(false)
      }
    } catch (error) {
      console.error('Can\'t create playlist', error);
    }
  };

  const closeModal=()=>{
    props.playlistModal(false);
  }
  

  return (
    <>
      <div className='modal-wrapper'></div>
      <div className='modal-container px-2' onClick={closeModal}>
        {/* <div style={{color: "white", padding: "0"}}>
          <i
            className="fa-solid fa-xmark curpoint"
            style={{ paddingRight: ".2rem" }}
          ></i>
        </div> */}
        <div className='modal-content'>
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
