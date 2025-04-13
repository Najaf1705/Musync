import React, { useState, useEffect } from 'react';
import '../../App.css';
import SearchForm from './searchForm';
import VideoList from './videoList';
import SelectedVideoPlayer from './selectedVideoPlayer';

const Download = ({ selectedSong }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  useEffect(() => {
    setSearchQuery(selectedSong);
    console.log(selectedSong);
  }, [selectedSong]);

  const handleSearch = async () => {
    const API_KEY = process.env.REACT_APP_YOUTUBE_KEY2;
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

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setIsVideoVisible(true);
  };

  const handleDownload = async () => {
    if (selectedVideo) {
      const videoId = selectedVideo.id.videoId;
      const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPID_KEY,
          'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
        },
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
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
        <div className="container">
          <VideoList
            videos={searchResults}
            selectedVideo={selectedVideo}
            onVideoSelect={handleVideoSelect}
          />
          <SelectedVideoPlayer
            video={selectedVideo}
            isVisible={isVideoVisible}
            onClose={() => setIsVideoVisible(false)}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default Download;