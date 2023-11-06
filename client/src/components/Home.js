import React, { useState, useEffect } from 'react';
// import Download from './Download';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopPL from './TopPL'

const Home = (props) => {
  const navigate = useNavigate();
  const [songName, setSongName] = useState('');
  const [songData, setSongData] = useState(null);
  // const [data, setData] = useState({});
  // const [loginRequired, setLoginRequired] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);

  const [likedSongsState, setLikedSongsState] = useState(likedSongs);
  
  
    useEffect(() => {
      likedSongsArray();
    }); 

  const searchSong = async () => {
    try {
      const response = await fetch(`/api/search?name=${songName}`);
      const data = await response.json();
      setSongData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    await searchSong();
    setSongName('');
  };
  
  const handleDownload = (songDetails) => {
    props.onSelectedSongChange(songDetails);
    navigate('/download');
  };

const getUserInfo = async () => {
  try {
    const response = await fetch('/serverprofile', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return response; 

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


// Like Song
const sendLikeSong = async (userId, trackId) => {
  try {
    const response = await fetch(`/api/like-song/${userId}/${trackId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      // console.log('Song liked successfully');
    } else if (response.status === 400) {
      // console.error('Song is already liked');
      const updatedLikedSongs = likedSongsState.filter((id) => id !== trackId);
      setLikedSongsState(updatedLikedSongs);
      // console.log(likedSongsState);
      // Unlike it
      // console.log('Unliking with userId:', userId);
      await sendUnlikeSong(userId, trackId);
    } else {
      // console.error('Failed to like the song. Status:', response.status);
    }
  } catch (error) {
    console.error('Error liking the song:', error);
  }
};

// Unlike Song
const sendUnlikeSong = async (userId, trackId) => {
  try {
    const response = await fetch(`/api/unlike-song/${userId}/${trackId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      // console.log('Song unliked successfully');
    } else if (response.status === 400) {
      // console.error('Song not found in liked songs');

      const updatedLikedSongs = [...likedSongsState, trackId];
      setLikedSongsState(updatedLikedSongs);
      // console.log(likedSongsState);
      // Like it
      // console.log('Liking with userId:', userId);
      await sendLikeSong(userId, trackId);
    } else {
      // console.error('Failed to unlike the song. Status:', response.status);
    }
  } catch (error) {
    console.error('Error unliking the song:', error);
  }
};



const handleLikeSong = async (e, trackId) => {
  e.preventDefault();

  try {
    const res = await getUserInfo();

    if (res.status === 200) {
      const userdata = await res.json();
      // console.log('User Data:', userdata);
      const userId=await userdata._id;
      // console.log(userId);

      if (likedSongsState.includes(trackId)) {
        const updatedLikedSongs = likedSongsState.filter((id) => id !== trackId);
        setLikedSongsState(updatedLikedSongs);
        // console.log(likedSongsState);
        // console.log('Unliking with userId:', userId);
        // Unlike it
        await sendUnlikeSong(userId, trackId);
      } else {
        const updatedLikedSongs = [...likedSongsState, trackId];
        setLikedSongsState(updatedLikedSongs);
        // console.log(likedSongsState);
        // console.log('Liking with userId:', userId);
        // Like it
        await sendLikeSong(userId, trackId);
      }
    } else if (res.status === 401) {
      // showLoginRequiredMessage();
      toast.warning("You need to login to like a song");
    } else {
      throw new Error('Request failed with status ' + res.status);
    }
  } catch (error) {
    console.error(error);
    navigate('/login');
  }
};




  // const likeSong = async (e,trackId) => {
  //   e.preventDefault();
  //   try {
  //     const res = await getUserInfo();
  //     if (res.status === 200) {
  //       const userdata = await res.json();
  //       console.log(userdata);
  //       setData(userdata);
  //       sendLikeSong(data._id, trackId);
  //     } else if (res.status === 401) {
  //       showLoginRequiredMessage();
  //     } else {
  //       // Handle other errors
  //       throw new Error('Request failed with status ' + res.status);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     navigate('/login');
  //   }
  // };

  const likedSongsArray = async () => {
    try {
      const res = await getUserInfo();
  
      if (res.status === 200) {
        const userdata = await res.json();
        // console.log(userdata._id);
        const userId = userdata._id;
  
        const likedSongsResponse = await fetch(`/api/liked-songs/${userId}`);
        // console.log(likedSongsResponse);
        
        if (likedSongsResponse.status === 200) {
          const likedSongs = await likedSongsResponse.json();
          // console.log("Liked Songs:", likedSongs);
          setLikedSongs(likedSongs);
        } else {
          console.error("Error fetching liked songs. Status:", likedSongsResponse.status);
        }
      } else {
        console.log("User not authenticated.");
      }
    } catch (error) {
      console.error("LikedSongsArray error:", error);
    }
  };

  // const showLoginRequiredMessage = () => {
  //   setLoginRequired(true);
  //   setTimeout(() => {
  //     setLoginRequired(false);
  //   }, 2000);
  // };

  const isSongLiked = (trackId) => likedSongs.includes(trackId);
  

  return (
    <div className="home  pb-3">
      <div className="mx-2">
        <div className="mx-2 d-flex flex-column my-2">
          <div className="">
            <h3 className="text-center">Search Song</h3>
          </div>
          {/* {loginRequired && (
            <div className="alert alert-warning mt-3" role="alert">
              You need to log in to like songs.
            </div>
          )} */}
          <form
            onSubmit={handleSubmit}
            className="input-group d-flex justify-content-center mt-3"
          >
            <input
              type="text"
              className="form-control-md"
              placeholder="Enter Song Name"
              value={songName}
              required
              onChange={(e) => setSongName(e.target.value)}
            />
            <div className="input-group-append mx-2">
              <button className="" type="submit">
                Search
              </button>
            </div>
          </form>

          {songData && songData.tracks && songData.tracks.items.length > 0 && (
            <div>
              <div className="mt-2">
                <h4 className="mb-1">Search Results</h4>
              </div>
              <div className="card-deck row d-flex justify-content-center mx-1 my-3 pb-3">
                {songData.tracks.items.map((item) => (
                  <div
                    className="card col-md-3 col-6 mb-3"
                    key={item.id}
                  >
                    <img
                      src={item.album.images[0].url}
                      className="card-img-top pt-2"
                      alt={item.name}
                    />
                    <div className="card-body">
                      <p className="card-text">
                        {item.name} -{" "}
                        {item.artists.map((artist) => artist.name).join(", ")}
                      </p>
                      <div className="cardbuts">
                        <button
                          className="downbt"
                          onClick={() =>
                            handleDownload(
                              item.name + " " + item.artists[0].name
                            )
                          }
                        >
                          Download
                        </button>
                        {isSongLiked(item.id) ? (
                          <i
                            className="fa-solid fa-heart fa-xl"
                            style={{ color: "#ff3838" }}
                            onClick={(e) => handleLikeSong(e,item.id)}
                          ></i>
                        ) : (
                          <i
                            className="fa-regular fa-heart fa-xl"
                            onClick={(e) => handleLikeSong(e,item.id)}
                          ></i>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Outlet />
          <TopPL />
        </div>
      </div>
    </div>
  );
};

export default Home;
