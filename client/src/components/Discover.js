import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Discover = (props) => {
  const navigate = useNavigate();
  const [songName, setSongName] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  // const [nosong, setNosong] = useState("");
  const [songDetails, setSongDetails] = useState([]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recommendations?songName=${songName}`);
      if (response.status === 200) {
        const data = await response.json();
        setRecommendations(data);
        setSongDetails([]);
        // setNosong("");

        // Fetch details for each recommendation
        const detailsPromises = data.map(async (recommendation) => {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search?name=${recommendation}`);
          if (response.ok) {
            // document.getElementById('card-deck').innerHTML = "";
            const data = await response.json();
            return data.tracks.items[0];
          } else {
            return null;
          }
        });

        const details = await Promise.all(detailsPromises);
        setSongDetails(details);
      } else {
        toast.error(`Can't find "${songName}" in dataset`);
        // setNosong("Can't find the song in the dataset");
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
    <div className='home pb-3'>
      <div className='container'>
        <div className=' container d-flex flex-column my-2'>
          <div className="back-blur">
            <h3 className='text-center'>Get Song Recommendations</h3>
          </div>
          <form className='input-group d-flex justify-content-center mt-2'>
            <input
              type="text"
              className="form-control-md"
              placeholder="Enter Song Name"
              value={songName}
              onChange={(e) => setSongName(e.target.value.toLowerCase())}
            />
            <div className='input-group-append mx-2 '>
            <button
              className=" "
              type="submit"
              onClick={handleFetchRecommendations}
            >
              Search
            </button>
            </div>
          </form>

          {recommendations.length>0&&(
          <div
            id="card-deck"
            className="my-4 card-deck row d-flex justify-content-center pb-3">
              {songDetails.map((song, index) => (
                <div key={index} className="card col-md-3 col-sm-3 mb-3 mx-4">
                  <img
                    src={
                      song ? song.album.images[0].url : "placeholder-image-url"
                    }
                    alt="Song Cover"
                    className="card-img-top pt-2"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {song ? song.name : "Song not found"}
                    </h5>
                    <p className="card-text">
                      {song ? `${song.artists[0].name}` : ""}
                    </p>
                    <button className="  w-50 downbt" onClick={() => handleDownload(song.name+' '+song.artists[0].name)}>
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
