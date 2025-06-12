import React from 'react'
import { useSelector } from 'react-redux'
import PlaylistCard from '../playlistCard';

const PlaylistList = () => {
  const playlistsData = useSelector((state) => state.songs.userPlaylists);
  return (
    <div className="flex flex-wrap justify-center mx-1">
      {playlistsData.map((playlist, index) => (
        <PlaylistCard
          playlist={{
            ...playlist,
            id: playlist._id || playlist.id,
            name: playlist.playlistName,
            images: [{ url: "/images/playlists.png" }],
            owner: { display_name: "You" }
          }}
          key={playlist._id || playlist.id || index}
          // Add other props as needed
        />
      ))}
    </div>
  )
}

export default PlaylistList;