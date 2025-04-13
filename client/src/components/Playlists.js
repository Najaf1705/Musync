import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreatePlaylist from "./CreatePlaylist";

const Playlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [loading, setLoading] = useState(false);
  const [displaySongs, setDisplaySongs] = useState(false);
  const [likedSongsData, setLikedSongsData] = useState([]);
  const [selectedPlaylistSongsData, setSelectedPlaylistSongsData] = useState([]);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Fetch liked songs details
  useEffect(() => {
    const fetchSongDetails = async () => {
      if (!userDetails?.likedSongs?.length) return;

      try {
        setLoading(true);
        const promises = userDetails.likedSongs.map(async (song) => {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/${song}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch song details for ID: ${song}`);
          }
          return await response.json();
        });

        const allSongDetails = await Promise.all(promises);
        setLikedSongsData(allSongDetails);
      } catch (error) {
        console.error("Error fetching song details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [userDetails?.likedSongs]);

  const handleSelectedPlaylistSongs = async (pname) => {
    const selectedPlaylist = userDetails.playlists.find(
      (playlist) => playlist.playlistName === pname
    );

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
      <div className="mx-2">
        <h2 className="mx-4 mt-3">
          {displaySongs === false ? "Playlists" : selectedPlaylistName}
        </h2>
        <div className="row card-deck d-flex justify-content-center mx-1">
          {displaySongs === false ? (
            <>
              <div
                className="col-4 col-md-4 col-lg-3 mb-3 curpoint"
                onClick={() => {
                  setDisplaySongs(true);
                  setSelectedPlaylistName("Liked Songs");
                }}
              >
                <div
                  style={{
                    minHeight: "6rem",
                    minWidth: "100%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/images/playlists.png"
                    alt="heheh"
                    className="card-img-top mx-0"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="card-body mt-1">
                  <h6 className="card-title mb-0">💗Liked Songs</h6>
                </div>
              </div>
              {userDetails.playlists.map((items, index) => (
                <div
                  className="col-4 col-md-4 col-lg-3 mb-3 curpoint"
                  onClick={() => {
                    setDisplaySongs(true);
                    setSelectedPlaylistName(items.playlistName);
                    handleSelectedPlaylistSongs(items.playlistName);
                  }}
                  key={index}
                >
                  <div
                    style={{
                      minHeight: "6rem",
                      minWidth: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src="/images/playlists.png"
                      alt="heheh"
                      className="card-img-top mx-0"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="card-body mt-1">
                    <h6 className="card-title mb-0">{items.playlistName}</h6>
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-center align-items-center col-4 col-md-4 col-lg-3 mb-3 curpoint">
                <div className="d-flex flex-column justify-content-center align-items-center card-body mt-1">
                  <i
                    className="fa-solid fa-circle-plus fa-5x"
                    onClick={() => {
                      setPlaylistModal(true);
                    }}
                  ></i>
                  <h4 style={{ textAlign: "center" }}>Create playlist</h4>
                </div>
              </div>
            </>
          ) : (
            <>
              <i
                className="fa-solid fa-xmark fa-xl curpoint"
                style={{
                  marginLeft: "1rem",
                  marginBottom: "2rem",
                }}
                onClick={() => {
                  setDisplaySongs(false);
                }}
              ></i>
              <div>
                {loading && (
                  <div className="text-center mb-4">
                    <i className="fa-solid fa-rotate fa-spin fa-2xl"></i>
                  </div>
                )}
              </div>
              {selectedPlaylistName === "Liked Songs" ? (
                <>
                  {likedSongsData.length > 0 ? (
                    likedSongsData.map((item, index) =>
                      item.id &&
                      item.album?.images[0]?.url &&
                      item.name &&
                      item.artists ? (
                        <div
                          className="card col-5 col-md-4 col-lg-3 mb-3 mx-2"
                          key={item.id}
                        >
                          <div style={{ minHeight: "6rem", minWidth: "100%" }}>
                            <img
                              src={item.album.images[0].url}
                              className="card-img-top pt-2"
                              alt={item.name}
                            />
                          </div>
                          <div className="card-body">
                            <p className="card-text">
                              {item.name.slice(0, 30)} -{" "}
                              {item.artists
                                .map((artist) => artist.name)
                                .join(", ")
                                .slice(0, 30)}
                            </p>
                          </div>
                        </div>
                      ) : null
                    )
                  ) : (
                    <h3
                      className="d-flex justify-content-center"
                      style={{ paddingBottom: "3rem" }}
                    >
                      You have not liked any songs yet
                    </h3>
                  )}
                </>
              ) : (
                <>
                  {selectedPlaylistSongsData.length > 0 ? (
                    selectedPlaylistSongsData.map((item, index) =>
                      item.id &&
                      item.album?.images[0]?.url &&
                      item.name &&
                      item.artists ? (
                        <div
                          className="card col-5 col-md-4 col-lg-3 mb-3 mx-2"
                          key={item.id}
                        >
                          <div style={{ minHeight: "6rem", minWidth: "100%" }}>
                            <img
                              src={item.album.images[0].url}
                              className="card-img-top pt-2"
                              alt={item.name}
                            />
                          </div>
                          <div className="card-body">
                            <p className="card-text">
                              {item.name.slice(0, 30)} -{" "}
                              {item.artists
                                .map((artist) => artist.name)
                                .join(", ")
                                .slice(0, 30)}
                            </p>
                          </div>
                        </div>
                      ) : null
                    )
                  ) : (
                    <h3
                      className="d-flex justify-content-center"
                      style={{ paddingBottom: "3rem" }}
                    >
                      You have not added any songs yet
                    </h3>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div id="gg">{displaySongs}</div>
      </div>
      {playlistModal && (
        <CreatePlaylist
          playlistModal={setPlaylistModal}
        />
      )}
    </div>
  );
};

export default Playlist;