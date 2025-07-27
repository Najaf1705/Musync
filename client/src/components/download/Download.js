import React, { useState, useEffect } from 'react';
import '../../App.css';
import VideoList from './videoList';
import SelectedVideoPlayer from './selectedVideoPlayer';
import SearchBar from '../common/searchBar';
import { useDispatch, useSelector } from 'react-redux';
import { setDownloadQuery, setDownloadSearchResults } from '../../redux/features/downloadSlice';

const Download = () => {
  const dispatch = useDispatch();
  const downloadQuery = useSelector((state) => state.download.downloadQuery);
  const downloadSearchResults = useSelector((state) => state.download.downloadSearchResults);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [loading, setLoading] = useState(false); // <-- loading state

  // Refactored handleSearch to allow calling without event
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!downloadQuery) return;
    setLoading(true); // start loading
    const API_KEY = process.env.REACT_APP_YOUTUBE_KEY2;
    const maxResults = 20;
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&q=${downloadQuery}&maxResults=${maxResults}&type=video`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      dispatch(setDownloadSearchResults(data.items || []));
      setSelectedVideo(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  // Call handleSearch on mount if downloadQuery is not empty
  useEffect(() => {
    if (downloadQuery && downloadQuery.trim() !== "") {
      handleSearch();
    }
    // eslint-disable-next-line
  }, []); // Only on mount

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
          window.open(result.link);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSetSongName = (name) => {
    dispatch(setDownloadQuery(name));
  };

  return (
    <div className="home pb-6">
      <div className="flex flex-col my-2 mx-auto">
        <div className="back-blur">
          <h3 className="text-center text-2xl font-semibold py-2">Download Song</h3>
        </div>
        <SearchBar
          songName={downloadQuery}
          setSongName={handleSetSongName}
          handleSubmit={handleSearch}
        />
        <div>
          {loading ? (
            <div>
              {/* <h4 className="text-xl font-semibold mt-4 mb-2">Videos</h4> */}
              <div className="flex flex-wrap justify-center my-4 pb-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md m-2 p-3 w-56 md:w-80 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition h-56"
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <VideoList
                videos={downloadSearchResults}
                selectedVideo={selectedVideo}
                onVideoSelect={handleVideoSelect}
              />
              <SelectedVideoPlayer
                video={selectedVideo}
                isVisible={isVideoVisible}
                onClose={() => setIsVideoVisible(false)}
                onDownload={handleDownload}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Download;