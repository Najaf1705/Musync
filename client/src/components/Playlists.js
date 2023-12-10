import React, { useState } from 'react';

const Playlist = (props) => {

  const [displaySongs, setDisplaySongs] = useState(false);

  const showSongs=()=>{
    setDisplaySongs(true)
  }

  const dontShowSongs=()=>{
    setDisplaySongs(false)
  }

  return (
    <div className='home'>
      <div className="mx-2">
        <h2 className='mx-4 mt-3'>Playlist</h2>
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
                get items using track id and display
              </div>
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
