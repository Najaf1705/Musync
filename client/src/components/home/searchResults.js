import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import SongCard from "../songCard";
import PlaylistCard from "../playlistCard";
import { setSearchedPlaylistData, setSearchResults } from "../../redux/features/songSlice";

const SearchResults = ({ setSongName }) => {
  const { searchResults, searchedPlaylistData, loading } = useSelector(state => state.songs);

  const dispatch = useDispatch();
  const [displayPlaylistSongs, setDisplayPlaylistSongs] = useState(false);

  if (loading) {
    return <div className="text-center"><i className="fa-solid fa-spinner fa-spin"></i></div>;
  }

  const clearSearchResults = () => {
    dispatch(setSearchResults(null)); // Clear search results in Redux state
    dispatch(setSearchedPlaylistData(null));
    setSongName(""); // Reset song name in parent component

    // Clear search results by dispatching an action or resetting state
    // Assuming you have an action to clear search results
    // dispatch(clearSearchResultsAction());
  }

  return (
    <div>
      {/* Songs */}
      {searchResults?.items?.length > 0 ? (
        <div>

          <h4 className="text-xl font-semibold mt-4 mb-2">
            <i
              className="fa-solid fa-xmark fa-lg cursor-pointer text-gray-800 hover:text-red-500 mr-4 mt-1"
              onClick={clearSearchResults} // Clear search results
              title="Close"
            ></i>
            Search Results
          </h4>
          <div className="flex flex-wrap justify-center pb-3 mx-1">
            {searchResults.items.map((item, index) => (
              <SongCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Playlists */}
      {displayPlaylistSongs === false ? (
        <>
          {searchedPlaylistData?.items?.length > 0 ? (
            <div>
              <h4 className="text-lg font-semibold mt-4 mb-2">Playlists</h4>
              <div className="flex flex-wrap justify-center pb-3 mx-1">
                {searchedPlaylistData.items
                  .filter(playlist => playlist?.id)
                  .map(playlist => 
                    // {
                    (
                      <PlaylistCard key={playlist.id} playlist={playlist} />
                    )
                    // console.log("Playlist:", playlist);
                  // }
                  )}
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        // <PlaylistDetail
        //   selectedPlaylistData={selectedPlaylistData}
        //   setDisplaySongs={setDisplaySongs}
        //   selectedPlaylistSongsData={selectedPlaylistSongsData}
        // />
        <></>
      )}
    </div>
  );
};

export default SearchResults;