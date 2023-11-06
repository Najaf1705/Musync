import React, { useState, useEffect } from 'react';
import '../App.css';

// import { NavLink } from 'react-router-dom';

const Download = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  // const [songNum, setSongNum] = useState(null);

  useEffect(() => {
      setSearchQuery(props.selectedSong);
      console.log(props.selectedSong);
      // handleSearch();
  }, [props.selectedSong]);

  const handleSearch =async () => {
    const API_KEY = process.env.REACT_APP_YOUTUBE_KEY2;
    // const API_KEY = 'AIzaSyBnWPIeBxsAGLcAufmFNW9Sil1aesGyy94';
    const maxResults = 20;

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&q=${searchQuery}&maxResults=${maxResults}&type=video`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setSearchResults(data.items);
      setSelectedVideo(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleHandleSearch=async (e)=>{
    e.preventDefault();
    await handleSearch();
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setIsVideoVisible(true);
  };

  const handleDownload =async () => {
    if (selectedVideo) {
      const videoId = selectedVideo.id.videoId;

      const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPID_KEY,
          'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        }
      };
      
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        if (result.link) {
          console.log(`Download Link: ${result.link}`);

          window.open(result.link);
        } else {
          console.log('No download link found in the response');
        }
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="home pb-3">
      <div className="container d-flex flex-column my-2">
        <div className="back-blur">
          <h3 className="text-center">Download Song</h3>
        </div>
        <form className="input-group mt-3 d-flex justify-content-center">
          <input
            id="inp"
            type="text"
            className="form-control-md"
            placeholder="Search for videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="input-group-append mx-2">
            <button
              className=""
              type="submit"
              onClick={handleHandleSearch}
            >
              Search
            </button>
          </div>
        </form>
        <div className="container">
          {searchResults && searchResults.length > 0 && (
            <div className="col-md-12">
              <div className="card-deck row d-flex justify-content-center my-4 pb-3">
                {searchResults.map((video) => (
                  <div
                    key={video.id.videoId}
                    className={`video-item card mb-3 mx-2 curpoint ${
                      selectedVideo &&
                      selectedVideo.id.videoId === video.id.videoId
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <img
                      src={video.snippet.thumbnails.default.url}
                      alt={video.snippet.title}
                      className="card-img-top pt-2"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{video.snippet.title}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="col-md-6">
            <div className="selected-video-container d-flex justify-content-center align-items-center">
              {isVideoVisible && (
                <div className="floating-video">
                  <button
                    className="-danger vidclosebt"
                    onClick={() => setIsVideoVisible(false)}
                  >
                    X
                  </button>
                  <iframe
                    title="Selected Video"
                    className="responsive-iframe"
                    width="100%"
                    height="222"
                    src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}
                    frameBorder="0"
                    allowFullScreen
                  />
                  <button
                    className="  w-50"
                    onClick={handleDownload}
                  >
                    Download Song
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
