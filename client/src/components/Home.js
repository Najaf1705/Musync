import React, { useState, useEffect, useCallback } from 'react';
// import Download from './Download';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {ColorExtractor} from 'react-color-extractor';
import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import TopPL from './TopPL'

const Home = (props) => {
  const navigate = useNavigate();

  const [songName, setSongName] = useState('');
  const [songData, setSongData] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [likedSongs, setLikedSongs] = useState(props.userDetails.likedSongs || []);
  // const [likedSongsState, setLikedSongsState] = useState(likedSongs);
  const [loading, setLoading] = useState(false);  
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

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


// immediatly update likedSongs
  useEffect(() => {
    setLikedSongs(props.userDetails.likedSongs || []);
}, [props.userDetails.likedSongs,props.updateUserDetails]);

// const gg=()=>{
//   console.log();
// }

// gg();


  const [cardColors, setCardColors] = useState([]);
  const [cardTextColors, setCardTextColors] = useState([]);

  const handleColors = (colors, cardIndex) => {
    if (colors && colors.length > 0) {
      const dominantColor = colors[0];
      const hexColor = dominantColor.replace(/^#/, "");

      // Convert to RGB
      let bigint = parseInt(hexColor, 16);
      let r = (bigint >> 16) & 255;
      let g = (bigint >> 8) & 255;
      let b = bigint & 255;

      // Calculate perceived brightness using YIQ formula
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      // Choose a text color based on perceived brightness
      const textColor = brightness > 128 ? "#000000" : "#FFFFFF";
      // const textColor = colors[36];
  
      // Use the cardIndex to update the specific card's colors in the arrays
      setCardColors((prevColors) => {
        const updatedColors = [...prevColors];
        updatedColors[cardIndex] = dominantColor;
        return updatedColors;
      });
  
      setCardTextColors((prevTextColors) => {
        const updatedTextColors = [...prevTextColors];
        updatedTextColors[cardIndex] = textColor;
        return updatedTextColors;
      });
    }
  };

  
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
  
  

  const searchSong = useCallback(async () => {
    try {
      setLoading(true);
      const songResponse = await fetch(`/api/search?name=${songName}`);
      const data = await songResponse.json();
      setSongData(data);

      const playlistsResponse = await fetch(`/api/search-playlists?name=${songName}`);
      const playlistsData = await playlistsResponse.json();
      // console.log(playlistsData);
      setPlaylistData(playlistsData);
    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false);
    }
  },[songName]);


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

  useEffect(() => {
    // Load recent searches from local storage when the component mounts
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(storedSearches);
  }, []);

  const saveRecentSearchesToLocalStorage = (searches) => {
    // Save recent searches to local storage
    localStorage.setItem('recentSearches', JSON.stringify(searches));
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (songName.trim() !== '' && !recentSearches.includes(songName)) {
      const updatedSearches = [songName, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedSearches);
      saveRecentSearchesToLocalStorage(updatedSearches);
    }
    // await searchSong();
    // setSongName('');
  };

  const handleRemoveRecent = (removedItem) => {
  const updatedSearches = recentSearches.filter(item => item !== removedItem);
  setRecentSearches(updatedSearches);
  saveRecentSearchesToLocalStorage(updatedSearches);
};
  
  const handleDownload = (songDetails) => {
    props.onSelectedSongChange(songDetails);
    navigate('/download');
  };

// const getUserInfo = async () => {
//   try {
//     const response = await fetch('/serverprofile', {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//     });
//     // console.log(response);
//     return response; 

//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// };

 // update likedSongs in the parent (App.js) component
 const handleUpdateLikedSongs = (newLikedSongs) => {
  const newUserDetails = {
    ...props.userDetails,
    likedSongs: newLikedSongs,
  };
  props.updateUserDetails(newUserDetails);
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
      const updatedLikedSongs = likedSongs.filter((id) => id !== trackId);
      setLikedSongs(updatedLikedSongs);
      // update in parent App.js
      handleUpdateLikedSongs(updatedLikedSongs);
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

      const updatedLikedSongs = [...likedSongs, trackId];
      setLikedSongs(updatedLikedSongs);
      // update in parent App.js
      handleUpdateLikedSongs(updatedLikedSongs);
      // Like it
      await sendLikeSong(userId, trackId);
    } else {
      // console.error('Failed to unlike the song. Status:', response.status);
    }
  } catch (error) {
    console.error('Error unliking the song:', error);
  }
};

// const handleLikeSong = async (e, trackId) => {
//   e.preventDefault();

//   try {
//     const res = await getUserInfo();

//     if (res.status === 200) {
//       const userdata = await res.json();
//       // console.log('User Data:', userdata);
//       const userId=await userdata._id;
//       // console.log(userId);

//       if (likedSongsState.includes(trackId)) {
//         const updatedLikedSongs = likedSongsState.filter((id) => id !== trackId);
//         setLikedSongsState(updatedLikedSongs);
//         // Unlike it
//         await sendUnlikeSong(userId, trackId);
//       } else {
//         const updatedLikedSongs = [...likedSongsState, trackId];
//         setLikedSongsState(updatedLikedSongs);
//         // Like it
//         await sendLikeSong(userId, trackId);
//       }
//     } else if (res.status === 401) {
//       toast.warning("You need to login to like a song");
//     } else {
//       throw new Error('Request failed with status ' + res.status);
//     }
//   } catch (error) {
//     console.error(error);
//     navigate('/login');
//   }
// };

const handleLikeSong = async (e, trackId) => {
  e.preventDefault();
    if (props.login) {
      const userId=await props.userDetails._id;
      // console.log(userId);

      if (likedSongs.includes(trackId)) {
        const updatedLikedSongs = likedSongs.filter((id) => id !== trackId);
        setLikedSongs(updatedLikedSongs);
        // Unlike it
        await sendUnlikeSong(userId, trackId);
      } else {
        const updatedLikedSongs = [...likedSongs, trackId];
        setLikedSongs(updatedLikedSongs);
        // Like it
        await sendLikeSong(userId, trackId);
      }
    } else {
      // toast.warning("You need to login to like a song");
      toast.warning(
        <span>
          You need to <Link to="/login">login</Link> to like a song
        </span>
      );
    }
};


  // const likedSongsArray = async () => {
  //   try {
  //     const res = await getUserInfo();
  
  //     if (res.status === 200) {
  //       const userdata = await res.json();
  //       // console.log(userdata._id);
  //       const userId = userdata._id;
  //       // console.log(userdata)
  
  //       const likedSongsResponse = await fetch(`/api/liked-songs/${userId}`);
  //       // console.log(likedSongsResponse);
        
  //       if (likedSongsResponse.status === 200) {
  //         const likedSongs = await likedSongsResponse.json();
  //         // console.log("Liked Songs:", likedSongs);
  //         setLikedSongs(likedSongs);
  //       } else {
  //         console.error("Error fetching liked songs. Status:", likedSongsResponse.status);
  //       }
  //     } else {
  //       console.log("User not authenticated.");
  //     }
  //   } catch (error) {
  //     console.error("LikedSongsArray error:", error);
  //   }
  // };

  const isSongLiked = (trackId) => likedSongs.includes(trackId);

  useEffect(() => {
    searchSong();
  }, [songName, searchSong]);  

  return (
    <div className="home  pb-3">
      <div className="mx-2">
        <div className="mx-2 d-flex flex-column mb-2">
          <div className="">
            <h3 className="">Ohiyooo {props.userDetails.name?(props.userDetails.name.split(" ")[0]):'Luffy'}</h3>
          </div>
          <form
            onSubmit={handleSubmit}
            className="input-group d-flex justify-content-center mt-1"
          >
            <input
              type="text"
              className="form-control-md"
              placeholder="Enter Song Name"
              value={songName}
              required
              onChange={(e) => {
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
          {recentSearches.length>0?(
            <div>
              <h6 style={{paddingTop: ".5rem"}}>Recents</h6>
              <ul style={{ display: "flex", listStyle: "none",marginBottom: "0",padding: "0" }}>
                <div style={{display: "flex",overflow: "auto"}}>
                  {recentSearches.map((search, index) => (
                    <li className='recents curpoint' style={{ }}
                    key={index}
                    >
                      <i
                      className="fa-solid fa-xmark curpoint"
                      style={{ paddingRight: ".2rem" }}
                        onClick={() => {
                        // setSongData(null);
                        handleRemoveRecent(search);
                        }}
                      ></i>
                      
                      <div
                      onClick={() => {
                      setSongName(search);
                      // console.log(songName);
                      // handleSubmit(e);
                    }}>
                        {search}
                      </div>
                    </li>
                  ))}
                </div>
              </ul>
            </div>
          ):("")}

          {songData && songData.tracks && songData.tracks.items.length > 0 && (
            <div>
              <div className="d-flex align-items-center mt-2">
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
              <div className="card-deck row d-flex justify-content-center pb-3 mx-1">
                <div>
                  {loading && (
                    <div className="text-center my-1">
                      <i className="fa-solid fa-rotate fa-spin fa-2xl"></i>
                      {/* <h4>Loading...</h4> */}
                    </div>
                  )}
                </div>
                <h3>Songs</h3>

                {scurrentItems.map((item, index) => (
                  // <ColorExtractor getColors={handleColors}>
                  item.id && item.album?.images[0]?.url && item.name && item.artists ? (
                    <div
                      className="card col-5 col-md-4 col-lg-3 mb-3 mx-2"
                      key={item.id}
                      style={{
                        backgroundColor: cardColors[index] || "",
                        color: cardTextColors[index] || "",
                      }}
                    >
                      <div style={{ minHeight: "8rem", minWidth: "100%" }}>
                        <ColorExtractor
                          getColors={(colors) => handleColors(colors, index)}
                        >
                          <img
                            loading="lazy"
                            src={item.album?.images[0]?.url}
                            className="card-img-top pt-2"
                            alt={item.name}
                          />
                        </ColorExtractor>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          {item.name.slice(0, 30) || <Skeleton />} -{" "}
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
                              // style={{ color: "#ff3838" }}
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
                  ):null
                  // </ColorExtractor>
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
                  <div>
                    {selectedPlaylist == null ? (
                      <div className="card-deck row d-flex justify-content-center my-3 pb-3">
                        <h3>Playlists</h3>
                        {pcurrentItems.map((playlist) => (
                          playlist.id && playlist.images[0]?.url && playlist.name && playlist.owner.display_name ? (
                            <div
                              className="col-4 col-md-4 col-lg-2 mb-3 curpoint"
                              key={playlist.id}
                              onClick={() => {
                                setSelectedPlaylist(playlist.id);
                                setSelectedPlaylistName(playlist.name);
                              }}
                            >
                              <div
                                style={{ minHeight: "6rem", minWidth: "100%" }}
                              >
                                <img
                                  loading="lazy"
                                  src={playlist.images[0].url}
                                  className="card-img-top pt-2"
                                  alt={playlist.name}
                                  // style={{minHeight: "15rem"}}
                                />
                              </div>
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
                          ):null
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
                                marginBottom: "2rem",
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
                          {playlistTracks.map((item, index) =>
                            item.track?.id &&
                            item.track?.album?.images[0]?.url &&
                            item.track?.name &&
                            item.track?.artists ? (
                              <div
                                className="card col-5 col-md-4 col-lg-3 mb-3 mx-2"
                                key={item.track.id}
                                style={{
                                  backgroundColor: cardColors[index] || "",
                                  color: cardTextColors[index] || "",
                                }}
                              >
                                <div
                                  style={{
                                    minHeight: "8rem",
                                    minWidth: "100%",
                                  }}
                                >
                                  <ColorExtractor
                                    getColors={(colors) =>
                                      handleColors(colors, index)
                                    }
                                  >
                                    <img
                                      loading="lazy"
                                      src={item.track.album.images[0].url}
                                      className="card-img-top pt-2"
                                      alt={item.name}
                                    />
                                  </ColorExtractor>
                                </div>
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
                                        // style={{ color: "#ff3838" }}
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
                          )}
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