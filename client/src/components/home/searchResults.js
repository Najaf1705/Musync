import React from "react";
import { useSelector } from 'react-redux';
import SongCard from "../songCard";
import PlaylistCard from "../playlistCard";

const SearchResults = () => {
  const { searchResults, playlistData, loading } = useSelector(state => state.songs);

  if (loading) {
    return <div className="text-center"><i className="fa-solid fa-spinner fa-spin"></i></div>;
  }

  return (
    <div>
      {/* Songs */}
      {searchResults?.items?.length > 0 ? (
        <div>
          <h4 className="text-lg font-semibold mt-4 mb-2">Search Results</h4>
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
      {playlistData?.items?.length > 0 ? (
        <div>
          <h4 className="text-lg font-semibold mt-4 mb-2">Playlists</h4>
          <div className="flex flex-wrap justify-center pb-3 mx-1">
            {playlistData.items
              .filter(playlist => playlist?.id)
              .map(playlist => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SearchResults;