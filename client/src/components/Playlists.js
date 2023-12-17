import React, { useState,useEffect } from 'react';
import {ColorExtractor} from 'react-color-extractor';


const Playlist = (props) => {

  const [loading, setLoading] = useState(false);  
  const [displaySongs, setDisplaySongs] = useState(false);
  const [likedSongsIDArray, setLikedSongsIDArray] = useState([]);
  const [likedSongsData, setLikedSongsData] = useState([]);
  
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
  
    useEffect(()=>{
      // setLikedSongsIDArray([...props.userDetails.likedSongs].reverse());
      setLikedSongsIDArray(props.userDetails.likedSongs);
    },[props.userDetails.likedSongs]);
  
  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        setLoading(true);
        const promises = (likedSongsIDArray ?? []).map(async (song) => {
          const response = await fetch(`/api/${song}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch song details for ID: ${song}`);
          }
          const songDetails = await response.json();
          return songDetails;
        });
  
        // Wait for all promises to resolve before updating the state
        const allSongDetails = await Promise.all(promises);
        setLikedSongsData(allSongDetails);
      } catch (error) {
        console.error('Error fetching song details:', error);
      }finally{
        setLoading(false);
      }
    };
  
    fetchSongDetails();
  }, [likedSongsIDArray]);
  

  const showSongs=()=>{
    setDisplaySongs(true)
  }

  const dontShowSongs=()=>{
    setDisplaySongs(false)
  }

  // useEffect(()=>{
  //   console.log(likedSongsData);
  // },[likedSongsData]);

  return (
    <div className='home'>
      <div className="mx-2">
        {displaySongs===false?(
          <h2 className='mx-4 mt-3'>Playlists</h2>
          ):(
          <h2 className='mx-4 mt-3'>Liked Songs</h2>
        )}
        <div className="row card-deck d-flex justify-content-center mx-1">
          {displaySongs===false?(
            <div
              className="col-4 col-md-4 col-lg-3 mb-3 curpoint"
              onClick={showSongs}
            >
              <div style={{minHeight: "6rem", minWidth: "100%", overflow: "hidden"}}>
                <img
                  src="/images/playlists.png"
                  alt="heheh"
                  className="card-img-top mx-0"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="card-body mt-1">
                <h6 className="card-title mb-0">💗Liked Songs</h6>
                {/* <p className="card-text">By You</p> */}
              </div>
            </div>
            ):(
            <>
              <i
                className="fa-solid fa-xmark fa-xl curpoint"
                style={{
                  marginLeft: "1rem",
                  marginBottom: "2rem"
                }}
                onClick={dontShowSongs}
              ></i>
              <div>
                  {loading && (
                    <div className="text-center mb-4">
                      <i className="fa-solid fa-rotate fa-spin fa-2xl"></i>
                      {/* <h4>Loading...</h4> */}
                    </div>
                  )}
                </div>
                {likedSongsData.length>0?(
                  likedSongsData.map((item,index) => (
                    item.id && item.album?.images[0]?.url && item.name && item.artists ? (
                      <div
                        className="card col-5 col-md-4 col-lg-3 mb-3 mx-2"
                        key={item.id}
                        style={{
                          backgroundColor: cardColors[index] || "",
                          color: cardTextColors[index] || ""
                        }}
                      >
                        <div style={{minHeight: "6rem", minWidth: "100%"}}>
                          <ColorExtractor getColors={(colors) => handleColors(colors, index)}>
                            <img
                              src={item.album.images[0].url}
                              className="card-img-top pt-2"
                              alt={item.name}
                            />
                            {/* <div>img</div> */}
                          </ColorExtractor>
                        </div>
  
                        <div className="card-body">
                          <p className="card-text">
                            {item.name.slice(0, 30)} -{" "}
                            {item.artists
                              .map((artist) => artist.name)
                              .join(", ")
                              .slice(0, 30)}
                          </p>
                          {/* <div>body</div> */}
                          {/* <div className="cardbuts">
                            <i
                              className="fa-solid fa-download fa-xl mr-2"
                              style={{ marginRight: "1rem" }}
                              onClick={() =>
                                props.handleDownload(
                                  item.track.name + " " + item.track.artists[0].name
                                )
                              }
                            ></i>
                            {props.isSongLiked(item.track.id) ? (
                              <i
                                className="fa-solid fa-heart fa-xl"
                                // style={{ color: "#ff3838" }}
                                onClick={(e) => props.handleLikeSong(e, item.track.id)}
                              ></i>
                            ) : (
                              <i
                                className="fa-regular fa-heart fa-xl"
                                onClick={(e) => props.handleLikeSong(e, item.track.id)}
                              ></i>
                            )}
                          </div> */}
                        </div>
                      </div>
                    ):null
                  ))
                ):(
                  <h3 className='d-flex justify-content-center' style={{paddingBottom: "3rem"}}>
                    You have not liked any songs yet
                  </h3>
                )}
                {/* get items using track id and display */}
            </>
          )}
        </div>
        <div id='gg'>
          {displaySongs}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
