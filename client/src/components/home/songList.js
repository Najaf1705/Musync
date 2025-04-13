import React from 'react';
import SongCard from './songCard';

const SongList = ({
  songs,
  cardColors,
  cardTextColors,
  handleColors,
  handleDownload,
  handleLikeSong,
  isSongLiked,
  playlists,
  addToPlaylist,
  setPlaylistModal,
  login,
}) => {
  return (
    <div className="card-deck row d-flex justify-content-center pb-3 mx-1">
      {songs.map((item, index) => (
        <SongCard
          key={item.id}
          item={item}
          index={index}
          cardColors={cardColors}
          cardTextColors={cardTextColors}
          handleColors={handleColors}
          handleDownload={handleDownload}
          handleLikeSong={handleLikeSong}
          isSongLiked={isSongLiked}
          playlists={playlists}
          addToPlaylist={addToPlaylist}
          setPlaylistModal={setPlaylistModal}
          login={login}
        />
      ))}
    </div>
  );
};

export default SongList;