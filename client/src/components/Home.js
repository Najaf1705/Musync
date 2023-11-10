import React, { useState, useEffect } from 'react';
// import Download from './Download';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopPL from './TopPL'

const Home = (props) => {
  const navigate = useNavigate();
  const [songName, setSongName] = useState('');
  const [songData, setSongData] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [likedSongsState, setLikedSongsState] = useState(likedSongs);
  const [loading, setLoading] = useState(false);  
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);


  const sitemsPerPage = 10;
  const [scurrentPage, setScurrentPage] = useState(1);
  const sindexOfLastItem = scurrentPage * sitemsPerPage;
  const sindexOfFirstItem = sindexOfLastItem - sitemsPerPage;
  const scurrentItems = songData && songData.tracks && songData.tracks.items
  ? songData.tracks.items.slice(sindexOfFirstItem, sindexOfLastItem)
  : [];
  
    const stotalPages = Math.ceil(
      (songData && songData.tracks && songData.tracks.items ? songData.tracks.items.length : 0) / sitemsPerPage
    );

  const pitemsPerPage = 6;
  const [pcurrentPage, setPcurrentPage] = useState(1);
  const pindexOfLastItem = pcurrentPage * pitemsPerPage;
  const pindexOfFirstItem = pindexOfLastItem - pitemsPerPage;
  const pcurrentItems = playlistData && playlistData.playlists && playlistData.playlists.items
  ? playlistData.playlists.items.slice(pindexOfFirstItem, pindexOfLastItem)
  : [];

  const ptotalPages = Math.ceil(
    (playlistData && playlistData.playlists && playlistData.playlists.items ? playlistData.playlists.items.length : 0) / pitemsPerPage
  );

  
  const spaginate = (spageNumber) => {
    if (spageNumber >= 1 && spageNumber <= stotalPages) {
      setScurrentPage(spageNumber);
    }
  }; 

  const ppaginate = (ppageNumber) => {
    if (ppageNumber >= 1 && ppageNumber <= ptotalPages) {
      setPcurrentPage(ppageNumber);
    }
  }; 

  const clearSelectedPlaylist = () => {
    setSelectedPlaylist(null);
    setSelectedPlaylistName(null);
  };
  
  useEffect(() => {
    likedSongsArray();
  } ); 
  

  const searchSong = async () => {
    try {
      setLoading(true);
      const songResponse = await fetch(`/api/search?name=${songName}`);
      const data = await songResponse.json();
      setSongData(data);

      const playlistsResponse = await fetch(`/api/search-playlists?name=${songName}`);
      const playlistsData = await playlistsResponse.json();
      console.log(playlistsData);
      setPlaylistData(playlistsData);
    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false);
    }
  };


  useEffect(() => {
    async function fetchPlaylistTracks() {
      if (selectedPlaylist) {
        try {
          setLoading(true);
          const response = await fetch(`/api/playlist-tracks/${selectedPlaylist}`);
          const data = await response.json();
          console.log(data);
          setPlaylistTracks(data.items);
        } catch (error) {
          console.error(error);
        }finally{
          setLoading(false);
        }
      } else {
        setPlaylistTracks([]); // Clear tracks if no playlist is selected
      }
    }

    fetchPlaylistTracks();
  }, [selectedPlaylist]);

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
    } else if (response.status === 400) {
      const updatedLikedSongs = likedSongsState.filter((id) => id !== trackId);
      setLikedSongsState(updatedLikedSongs);
      // Unlike it
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
    } else if (response.status === 400) {
      // console.error('Song not found in liked songs');

      const updatedLikedSongs = [...likedSongsState, trackId];
      setLikedSongsState(updatedLikedSongs);
      // Like it
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
        // Unlike it
        await sendUnlikeSong(userId, trackId);
      } else {
        const updatedLikedSongs = [...likedSongsState, trackId];
        setLikedSongsState(updatedLikedSongs);
        // Like it
        await sendLikeSong(userId, trackId);
      }
    } else if (res.status === 401) {
      toast.warning("You need to login to like a song");
    } else {
      throw new Error('Request failed with status ' + res.status);
    }
  } catch (error) {
    console.error(error);
    navigate('/login');
  }
};


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

  const isSongLiked = (trackId) => likedSongs.includes(trackId);
  

  return (
    <div className="home  pb-3">
      <div className="mx-2">
        <div className="mx-2 d-flex flex-column my-2">
          <div className="">
            <h3 className="text-center">Search Song</h3>
          </div>
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
              onChange={(e) =>{
                setSongName(e.target.value);
                clearSelectedPlaylist();
              }}
            />
            <div className="input-group-append mx-2">
              <button className="" type="submit">
                Search
              </button>
            </div>
          </form>

          {songData && songData.tracks && songData.tracks.items.length > 0 && (
            <div>
              <div className="d-flex align-items-center mt-4">
                <i
                  className="fa-solid fa-xmark fa-xl curpoint"
                  style={{ paddingBottom: ".5rem" }}
                  onClick={() => {
                    setSelectedPlaylist(null);
                    setSongData(null);
                  }}
                ></i>
                <h4 className="mx-2">{`Search Results`}</h4>
              </div>
              <div className="card-deck row d-flex justify-content-center my-3 pb-3 mx-1">
                <div>
                  {loading && (
                    <div className="text-center my-5">
                      <i className="fa-solid fa-rotate fa-spin fa-2xl"></i>
                      {/* <h4>Loading...</h4> */}
                    </div>
                  )}
                </div>
                <h3>Songs</h3>

                {scurrentItems.map((item) => (
                  <div
                    className="card col-5 col-md-4 col-lg-3 mb-3 mx-2"
                    key={item.id}
                  >
                    <img
                      src={item.album.images[0].url}
                      className="card-img-top pt-2"
                      alt={item.name}
                    />
                    <div className="card-body">
                      <p className="card-text">
                        {item.name.slice(0, 30)} -{" "}
                        {item.artists
                          .map((artist) => artist.name)
                          .join(", ")
                          .slice(0, 30)}
                      </p>
                      <div className="cardbuts">
                        <i
                          className="fa-solid fa-download fa-xl mr-2"
                          style={{ marginRight: "1rem" }}
                          onClick={() =>
                            handleDownload(
                              item.name + " " + item.artists[0].name
                            )
                          }
                        ></i>
                        {isSongLiked(item.id) ? (
                          <i
                            className="fa-solid fa-heart fa-xl"
                            style={{ color: "#ff3838" }}
                            onClick={(e) => handleLikeSong(e, item.id)}
                          ></i>
                        ) : (
                          <i
                            className="fa-regular fa-heart fa-xl"
                            onClick={(e) => handleLikeSong(e, item.id)}
                          ></i>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pagination justify-content-center mt-3">
                  <div aria-label="Page navigation example">
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          scurrentPage === 1 ? "disabled" : ""
                        } page-link`}
                      >
                        <i
                          className="fa-solid fa-backward fa-xl curpoint"
                          onClick={() => spaginate(scurrentPage - 1)}
                        ></i>
                      </li>
                      <li
                        className={`page-item ${
                          scurrentPage === stotalPages ? "disabled" : ""
                        } page-link`}
                      >
                        <i
                          className="fa-solid fa-forward fa-xl curpoint"
                          onClick={() => spaginate(scurrentPage + 1)}
                        ></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {playlistData &&
                playlistData.playlists &&
                playlistData.playlists.items.length > 0 && (
                  // <div className="card-deck row d-flex justify-content-center my-3 pb-3">
                  <div >
                    {selectedPlaylist == null ? (
                      <div className='card-deck row d-flex justify-content-center my-3 pb-3'>
                        <h3>Playlists</h3>
                        {pcurrentItems.map((playlist) => (
                          <div
                            className="col-4 col-md-4 col-lg-2 mb-3 curpoint"
                            key={playlist.id}
                            onClick={() => {
                              setSelectedPlaylist(playlist.id);
                              setSelectedPlaylistName(playlist.name);
                            }}
                          >
                            <img
                              src={playlist.images[0].url}
                              className="card-img-top pt-2"
                              alt={playlist.name}
                            />
                            <div className="card-body">
                              <p
                                className="card-text"
                                style={{ fontSize: ".9rem", fontWeight: "600" }}
                              >
                                {playlist.name} - {playlist.owner.display_name}
                              </p>
                              {/* Add more details or buttons as needed */}
                            </div>
                          </div>
                        ))}
                        <div className="pagination justify-content-center mt-3">
                          <div aria-label="Page navigation example">
                            <ul className="pagination">
                              <li
                                className={`page-item ${
                                  pcurrentPage === 1 ? "disabled" : ""
                                } page-link`}
                              >
                                <i
                                  className="fa-solid fa-backward fa-xl curpoint"
                                  onClick={() => ppaginate(pcurrentPage - 1)}
                                ></i>
                              </li>
                              <li
                                className={`page-item ${
                                  pcurrentPage === ptotalPages ? "disabled" : ""
                                } page-link`}
                              >
                                <i
                                  className="fa-solid fa-forward fa-xl curpoint"
                                  onClick={() => ppaginate(pcurrentPage + 1)}
                                ></i>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="mt-2">{selectedPlaylistName} Tracks</h4>
                        <div className="card-deck row d-flex justify-content-center my-3 pb-3 mx-1">
                          <div>
                            <i
                              className="fa-solid fa-xmark fa-xl curpoint"
                              style={{
                                marginLeft: "1rem",
                                marginBottom: "2rem"
                              }}
                              onClick={clearSelectedPlaylist}
                            ></i>
                            {loading && (
                              <div className="text-center my-5">
                                <i className="fa-solid fa-rotate fa-spin fa-2xl"></i>
                                {/* <h4>Loading...</h4> */}
                              </div>
                            )}
                          </div>
                          {playlistTracks.map((item) => (
                            item.track?.id && item.track?.album?.images[0]?.url && item.track?.name && item.track?.artists ? (
                              <div
                                className="card col-5 col-md-4 col-lg-3 mb-3 mx-2"
                                key={item.track.id}
                              >
                                <img
                                  src={item.track.album.images[0].url}
                                  className="card-img-top pt-2"
                                  alt={item.name}
                                />
                                <div className="card-body">
                                  <p className="card-text">
                                    {item.track.name.slice(0, 30)} -{" "}
                                    {item.track.artists
                                      .map((artist) => artist.name)
                                      .join(", ")
                                      .slice(0, 30)}
                                  </p>
                                  <div className="cardbuts">
                                    <i
                                      className="fa-solid fa-download fa-xl mr-2"
                                      style={{ marginRight: "1rem" }}
                                      onClick={() =>
                                        handleDownload(
                                          item.track.name +
                                            " " +
                                            item.track.artists[0].name
                                        )
                                      }
                                    ></i>
                                    {isSongLiked(item.track.id) ? (
                                      <i
                                        className="fa-solid fa-heart fa-xl"
                                        style={{ color: "#ff3838" }}
                                        onClick={(e) =>
                                          handleLikeSong(e, item.track.id)
                                        }
                                      ></i>
                                    ) : (
                                      <i
                                        className="fa-regular fa-heart fa-xl"
                                        onClick={(e) =>
                                          handleLikeSong(e, item.track.id)
                                        }
                                      ></i>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : null
                          ))}
                          {/* <div className="pagination justify-content-center mt-3">
                            <div aria-label="Page navigation example">
                              <ul className="pagination">
                                <li
                                  className={`page-item ${
                                    pcurrentPage === 1 ? "disabled" : ""
                                  } page-link`}
                                >
                                  <i
                                    className="fa-solid fa-backward fa-xl curpoint"
                                    onClick={() => ppaginate(pcurrentPage - 1)}
                                  ></i>
                                </li>
                                <li
                                  className={`page-item ${
                                    pcurrentPage === ptotalPages ? "disabled" : ""
                                  } page-link`}
                                >
                                  <i
                                    className="fa-solid fa-forward fa-xl curpoint"
                                    onClick={() => ppaginate(pcurrentPage + 1)}
                                  ></i>
                                </li>
                              </ul>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}
          <Outlet />
          <TopPL
            handleDownload={handleDownload}
            handleLikeSong={handleLikeSong}
            isSongLiked={isSongLiked}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;