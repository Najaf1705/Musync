import { useDispatch } from 'react-redux';
import { setSelectedPlaylist } from '../../redux/features/songSlice';

const PlaylistCard = ({
  parentComponent,
  playlist,
  setDisplaySongs,
  setSelectedPlaylistData,
  fetchSelectedPlaylistSongs
}) => {
  const dispatch = useDispatch();

  const handlePlaylistSelect = () => {

    if (parentComponent === "searchResults") {
      setDisplaySongs(true);
      setSelectedPlaylistData(playlist);
      fetchSelectedPlaylistSongs(playlist.id);
    }

    if (parentComponent === "playlist") {
      dispatch(setSelectedPlaylist({
        id: playlist.id,
        name: playlist.name
      }));
      setDisplaySongs(true);
      setSelectedPlaylistData(playlist);
      fetchSelectedPlaylistSongs(playlist.name);
    }
  };

  return (
    <div
      className="flex flex-col items-center rounded-lg shadow-md m-2 p-2 w-36 h-48 sm:w-48 sm:h-64 cursor-pointer bg-slate-300/10 hover:bg-slate-300/20 transition backdrop-blur-lg"
      onClick={handlePlaylistSelect}
      title={`${playlist.name} - ${playlist.owner.display_name ? playlist.owner.display_name : "Unknown Artist"}`}
    >
      <div className="w-full flex justify-center min-h-20 sm:min-h-24">
        <img
          loading="lazy"
          src={playlist.images[0]?.url}
          className="rounded-lg object-cover w-full h-full"
          alt={playlist.name}
        />
      </div>
      <div className="mt-2 text-center flex-1 flex items-center justify-center w-full">
        <p className="font-semibold text-xs sm:text-sm truncate max-w-[7.5rem] sm:max-w-[10rem]">
          {playlist.name} - {playlist.owner.display_name}
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;