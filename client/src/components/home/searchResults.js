import React from "react";
import { useSelector } from 'react-redux';
import SongCard from "./songCard";
import PlaylistCard from "./playlistCard";

const SearchResults = () => {
  const { searchResults, playlistData, loading } = useSelector(state => state.songs);

  // Add debug logging
  console.log('Search Results:', searchResults);
  console.log('Playlist Data:', playlistData);

  if (loading) {
    return <div className="text-center"><i className="fa-solid fa-spinner fa-spin"></i></div>;
  }

  return (
    <div>
      {/* Songs */}
      {searchResults?.items?.length > 0 ? (
        <div>
          <h4>Search Results</h4>
          <div className="card-deck row d-flex justify-content-center pb-3 mx-1">
            {searchResults.items.map((item, index) => (
              <SongCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <h5>No songs found</h5>
      )}

      {/* Playlists */}
      {playlistData?.items?.length > 0 ? (
        <div>
          <h4>Playlists</h4>
          <div className="card-deck row d-flex justify-content-center pb-3 mx-1">
            {playlistData.items
              .filter(playlist => playlist?.id)
              .map(playlist => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
          </div>
        </div>
      ) : (
        <h5>No playlists found</h5>
      )}
    </div>
  );
};

export default SearchResults;