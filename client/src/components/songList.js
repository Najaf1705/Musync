import SongCard from './songCard';
import { useSelector, useDispatch } from 'react-redux';

import { fetchLikedSongs } from '../redux/features/likeSlice';

const songData=useSelector((state) => state.songs);
console.log(songData);


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
  const dispatch = useDispatch();
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