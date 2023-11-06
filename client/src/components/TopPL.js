import React, { useEffect, useState } from 'react';

const TopPL = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/top`);
        const data = await response.json();
        setPlaylists(data.playlists.items);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <div className="">
        <h4 className="text-center my-2">Top Playlists on Spotify</h4>
      </div>
      <div className="col-md-12">
        <div className="row card-deck d-flex justify-content-center mx-1">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="col-6 col-md-4 col-lg-3 mb-3">
              <div className="card mx-2">
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="card-img-top"
                />
                <div className="card-body py-0">
                  <p className="card-title mb-0">{playlist.name}</p>
                  <p className="card-text">By {playlist.owner.display_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPL;
