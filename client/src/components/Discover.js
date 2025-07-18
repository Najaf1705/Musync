import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showErrorToast } from './utils/toast';
import SearchBar from './common/searchBar';

const Discover = (props) => {
  const navigate = useNavigate();
  const [songName, setSongName] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [songDetails, setSongDetails] = useState([]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recommendations?songName=${songName}`);
      if (response.status === 200) {
        const data = await response.json();
        setRecommendations(data);
        setSongDetails([]);

        // Fetch details for each recommendation
        const detailsPromises = data.map(async (recommendation) => {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search?name=${recommendation}`);
          if (response.ok) {
            const data = await response.json();
            return data.tracks.items[0];
          } else {
            return null;
          }
        });

        const details = await Promise.all(detailsPromises);
        setSongDetails(details);
      } else {
        showErrorToast(`Can't find "${songName}" in dataset`);
        setRecommendations([]);
        setSongDetails([]);
        return;
      }
    } catch (error) {
      console.log("Error in finding song");
    }
  };

  const handleFetchRecommendations = async (e) => {
    e.preventDefault(); 
    await fetchRecommendations();
  };

  const handleDownload = (songDetails) => {
    props.onSelectedSongChange(songDetails);
    navigate('/download');
  };

  return (
    <div className='home pb-6'>
      <div className='mx-auto max-w-4xl'>
        <div className='flex flex-col my-2'>
          <div className="back-blur">
            <h3 className='text-center text-2xl font-semibold py-2'>Get Song Recommendations</h3>
          </div>
          <SearchBar
            songName={songName}
            setSongName={setSongName}
            handleSubmit={handleFetchRecommendations}
          />

          {recommendations.length > 0 && (
            <div
              id="card-deck"
              className="my-4 flex flex-wrap justify-center pb-3"
            >
              {songDetails.map((song, index) => (
                <div key={index} className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md m-2 p-3 w-64">
                  <img
                    src={
                      song ? song.album.images[0].url : "placeholder-image-url"
                    }
                    alt="Song Cover"
                    className="rounded-lg object-cover w-full h-40 pt-2"
                  />
                  <div className="mt-2 text-center">
                    <h5 className="font-semibold text-base mb-0">
                      {song ? song.name : "Song not found"}
                    </h5>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {song ? `${song.artists[0].name}` : ""}
                    </p>
                    <button
                      className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition mt-2"
                      onClick={() => handleDownload(song.name + ' ' + song.artists[0].name)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Discover;
