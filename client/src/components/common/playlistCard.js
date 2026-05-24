import { useDispatch } from 'react-redux';
import { deletePlaylistThunk, setSelectedPlaylistThunk } from '../../redux/features/song/songThunks';
import { FiTrash } from 'react-icons/fi';
import { useDisclosure } from '@heroui/react';
import RemovePlaylistModal from './RemovePlaylistModal';
// import { useNavigate } from 'react-router-dom';

const PlaylistCard = ({
  parentComponent,
  playlist,
  setDisplaySongs,
  setSelectedPlaylistData,
  fetchSelectedPlaylistSongs,
  showDeleteButton = true

}) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handlePlaylistSelect = () => {

    if (parentComponent === "searchResults") {
      setDisplaySongs(true);
      setSelectedPlaylistData(playlist);
      fetchSelectedPlaylistSongs(playlist.id);
    }

    if (parentComponent === "playlist") {
      dispatch(setSelectedPlaylistThunk({
        id: playlist.id,
        name: playlist.playlistName
      }));
      setDisplaySongs(true);
      setSelectedPlaylistData(playlist);
      fetchSelectedPlaylistSongs(playlist.playlistName);
    }
    // navigate(`/playlist/${playlist.id}`);
  };

  const handleDeletePlaylist = () => {
    dispatch(deletePlaylistThunk({ playlistName: playlist.playlistName }));
  }

  return (
    <>
      <div
        className="flex flex-col items-center rounded-lg shadow-md m-2 p-2 w-36 h-48 sm:w-48 sm:h-64 cursor-pointer bg-slate-300/10 hover:bg-slate-300/20 transition backdrop-blur-lg"
        onClick={handlePlaylistSelect}
        title={`${playlist.playlistName}`}
      >
        <div className="w-full flex justify-center min-h-20 sm:min-h-24">
          <img
            loading="lazy"
            src={playlist.image}
            className="rounded-lg object-cover w-full h-full"
            alt={playlist.playlistName}
          />
        </div>
        <div className="mt-2 text-center flex-1 flex items-center justify-between w-full px-2">
          <p className="font-semibold text-xs sm:text-sm truncate max-w-[7.5rem] sm:max-w-[10rem] text-left">
            {playlist.playlistName}
          </p>
          {playlist.playlistName !== "Liked Songs" && showDeleteButton && (
            <button
              className="ml-2 text-red-700 hover:text-red-500"
              onClick={e => {
                e.stopPropagation();
                onOpen();
              }}
              title="Delete playlist"
            >
              <FiTrash />
            </button>
          )}
        </div>
      </div>


      <RemovePlaylistModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        playlistName={playlist.playlistName}
        handleDeletePlaylist={handleDeletePlaylist}
      />
    </>
  );
};

export default PlaylistCard;