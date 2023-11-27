import React, { useState, useEffect } from 'react';
import {ColorExtractor} from 'react-color-extractor';
const TopPL = (props) => {
  
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [selectedCountry, setSelectedCountry] = useState('JP');
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
      // const textColor = colors[39];
  
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

  const itemsPerPage = 18;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = playlistTracks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(playlistTracks.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  }; 
  
  const countries = [
    { name: 'Argentina', code: 'AR' },{ name: 'Australia', code: 'AU' },{ name: 'Brazil', code: 'BR' },{ name: 'Canada', code: 'CA' },{ name: 'France', code: 'FR' },{ name: 'Germany', code: 'DE' },{ name: 'India', code: 'IN' },{ name: 'Italy', code: 'IT' },{ name: 'Japan', code: 'JP' },{ name: 'Mexico', code: 'MX' },{ name: 'Netherlands', code: 'NL' },{ name: 'Norway', code: 'NO' },{ name: 'Pakistan', code: 'PK' },{ name: 'Russia', code: 'RU' },{ name: 'South Korea', code: 'KR' },{ name: 'Spain', code: 'ES' },{ name: 'Sweden', code: 'SE' },{ name: 'Switzerland', code: 'CH' },{ name: 'United Kingdom', code: 'GB' },{ name: 'United States', code: 'US' }];

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  useEffect(() => {
      const fetchPlaylists = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/top?country=${selectedCountry}`);
          const data = await response.json();
          setPlaylists(data.playlists.items);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
    fetchPlaylists();
  }, [selectedCountry]);
  
  const clearSelectedPlaylist = () => {
    setSelectedPlaylist(null);
    setSelectedPlaylistName(null);
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await fetch(`/api/top`);
  //       const data = await response.json();
  //       setPlaylists(data.playlists.items);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   fetchData();
  // }, []);

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

  return (
    <div className="toppl">
      {selectedPlaylist == null ? (
        <div>
          <div className="country-select my-3">
            <label htmlFor="countrySelect" className="pr-4">
              Select Country: 
            </label>
            <select
              id="countrySelect"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <h4 className="text-center my-2">Top Playlists on Spotify</h4>

          <div className="row card-deck d-flex justify-content-center mx-1">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="col-4 col-md-4 col-lg-3 mb-3 curpoint"
                onClick={() => {
                  setSelectedPlaylist(playlist.id);
                  setSelectedPlaylistName(playlist.name);
                }}
              >
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="card-img-top mx-0"
                />
                <div className="card-body mt-1">
                  <p className="card-title mb-0">{playlist.name}</p>
                  <p className="card-text">By {playlist.owner.display_name}</p>
                </div>
              </div>
            ))}
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
                  marginBottom: "2rem"
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
            {currentItems.map((item,index) => (
              item.track?.id && item.track?.album?.images[0]?.url && item.track?.name && item.track?.artists ? (
                <div
                  className="card col-5 col-md-4 col-lg-3 mb-3 mx-2"
                  key={item.track.id}
                  style={{
                    backgroundColor: cardColors[index] || "",
                    color: cardTextColors[index] || ""
                  }}
                >
                <ColorExtractor getColors={(colors) => handleColors(colors, index)}>
                  <img
                    src={item.track.album.images[0].url}
                    className="card-img-top pt-2"
                    alt={item.name}
                  />
                </ColorExtractor>

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
                    </div>
                  </div>
                </div>
              ):null
            ))}
            <div className="pagination justify-content-center mt-3">
              <div aria-label="Page navigation example">
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    } page-link`}
                  >
                    <i
                      className="fa-solid fa-backward fa-xl curpoint"
                      onClick={() => paginate(currentPage - 1)}
                    ></i>
                  </li>
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    } page-link`}
                  >
                    <i
                      className="fa-solid fa-forward fa-xl curpoint"
                      onClick={() => paginate(currentPage + 1)}
                    ></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopPL;
