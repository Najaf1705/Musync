import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import SongCard from "../common/songCard";
import PlaylistCard from "../common/playlistCard";
import PlaylistDetail from "../playlist/playlistDetail";
import { setSearchedPlaylistDataThunk, setSearchResultsThunk } from "../../redux/features/song/songThunks";
import CustomPagination from "../common/CustomPagination"; // <-- import here


const SearchResults = ({ setSongName, displayPlaylistSongs, setDisplayPlaylistSongs }) => {
  const { searchResults, searchedPlaylistData, loading } = useSelector(state => state.songs);

  const dispatch = useDispatch();
  const [selectedPlaylistData, setSelectedPlaylistData] = useState(null);
  const [selectedPlaylistSongsData, setSelectedPlaylistSongsData] = useState([]);
  const [loadingPlaylistSongs, setLoadingPlaylistSongs] = useState(false);

  const [songPage, setSongPage] = useState(1);
  const SONGS_PER_PAGE = 10;
  const songs = searchResults?.items || [];
  const totalPages = Math.ceil(songs.length / SONGS_PER_PAGE);
  const paginatedSongs = songs.slice((songPage - 1) * SONGS_PER_PAGE, songPage * SONGS_PER_PAGE);

  const fetchSelectedPlaylistSongs = async (pid) => {
    setSelectedPlaylistSongsData([]);
    try {
      setLoadingPlaylistSongs(true);
      const playlistData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/playlist-tracks/${pid}`);
      if (playlistData.ok) {
        const playlistDataResponse = await playlistData.json();
        if (!playlistDataResponse?.items?.length) return;
        const transformedPlaylistDataResponse = playlistDataResponse.items.map(item => item.track)
        console.log("transformedPlaylistDataResponse", transformedPlaylistDataResponse);

        setSelectedPlaylistSongsData(transformedPlaylistDataResponse);
      }
    } catch (error) {
      console.log("Error fetching playlist songs");
    } finally {
      setLoadingPlaylistSongs(false)
    }
  };

  useEffect(() => {
    setSongPage(1);
  }, [searchResults]);

  const clearSearchResults = () => {
    setDisplayPlaylistSongs(false)
    setSelectedPlaylistSongsData([]);
    dispatch(setSearchResultsThunk(null)); // Clear search results in Redux state
    dispatch(setSearchedPlaylistDataThunk(null));
    setSongName(""); // Reset song name in parent component
  };

  if (loading) {
    // Skeleton loader for loading state
    return (
      <div>
        <h4 className="text-xl font-semibold mt-4 mb-2">Search Results</h4>
        <div className="flex flex-wrap justify-center pb-3 mx-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-40 sm:w-56 h-64 bg-gray-700 animate-pulse rounded-lg m-2"
            ></div>
          ))}
        </div>
        <h4 className="text-lg font-semibold mt-4 mb-2">Playlists</h4>
        <div className="flex flex-wrap justify-center pb-3 mx-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-40 sm:w-56 h-48 bg-gray-700 animate-pulse rounded-lg m-2"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Songs */}
      {searchResults?.items?.length > 0 ? (
        <div>
          <h4 className="text-xl font-semibold mt-4 mb-2">
            <i
              className="fa-solid fa-xmark fa-lg cursor-pointer text-white hover:text-red-500 mr-4 mt-1"
              onClick={clearSearchResults} // Clear search results
              title="Close"
            ></i>
            Search Results
          </h4>
          <div className="flex flex-wrap justify-center pb-3 mx-1">
            {paginatedSongs.map((item, index) => (
              <SongCard key={item.id} item={item} index={index} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center my-4">
              <CustomPagination
                className=" backdrop-blur-sm rounded-md bg-white/10"
                page={songPage}
                onChange={setSongPage}
                total={totalPages}
              />
            </div>
          )}
        </div>
      ) : null}

      {/* Playlists */}
      {displayPlaylistSongs === false ? (
        <>
          {searchedPlaylistData?.length > 0 ? (
            <div>
              <h4 className="text-lg font-semibold mt-4 mb-2">Playlists</h4>
              <div className="flex flex-wrap justify-center pb-3 mx-1">
                {searchedPlaylistData
                  .filter(playlist => playlist?.id)
                  .map(playlist => (
                    <PlaylistCard
                      showDeleteButton={false}
                      parentComponent="searchResults"
                      key={playlist.id}
                      playlist={playlist}
                      setDisplaySongs={setDisplayPlaylistSongs}
                      setSelectedPlaylistData={setSelectedPlaylistData}
                      fetchSelectedPlaylistSongs={fetchSelectedPlaylistSongs}
                    />
                  ))}
              </div>
            </div>
          ) : null
        }
        </>
      ) : (
        <PlaylistDetail
          selectedPlaylistData={selectedPlaylistData}
          setDisplaySongs={setDisplayPlaylistSongs}
          selectedPlaylistSongsData={selectedPlaylistSongsData}
          loading={loadingPlaylistSongs}
        />
      )}
    </div>
  );
};

export default SearchResults;