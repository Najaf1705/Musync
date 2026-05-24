import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiPlus } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { addSongToPlaylistThunk, createPlaylistThunk, removeSongFromPlaylistThunk } from '../../redux/features/song/songThunks';
import { showErrorToast, showInfoToast, showSuccessToast } from '../utils/toast';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  useDisclosure,
} from '@heroui/react';
import RemoveSongModal from './RemoveSongModal';
import CreatePlaylistModal from './CreatePlaylistModal';

const PlaylistPopover = ({ songId }) => {
  const dispatch = useDispatch();
  const playlists = useSelector(state => state.songs.userPlaylists)?.filter(p => p.playlistName !== "Liked Songs") || [];
  const { isAuthReady, isLoggedIn, user: userDetails } = useSelector(state => state.user);

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);


  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');


  const addToPlaylist = (playlistId, playlistName) => {
    dispatch(addSongToPlaylistThunk({ playlistId, playlistName, songId }));
  };

  const handleRemove = () => {
    if (selectedPlaylist) {
      dispatch(removeSongFromPlaylistThunk({
        playlistId: selectedPlaylist._id,
        playlistName: selectedPlaylist.playlistName,
        songId
      }));
      showSuccessToast(`Removed song from ${selectedPlaylist.playlistName}`);
      setSelectedPlaylist(null);
    }
  };

  return (
    <>
      <Dropdown
        isOpen={dropDownOpen}
        onOpenChange={() => { setDropDownOpen(!dropDownOpen) }}
        showArrow
        classNames={{
          base: 'before:bg-default-200',
          content: 'p-0 border-small border-divider bg-background',
        }}
      >
        <DropdownTrigger
          onClick={() => {
            if (!isAuthReady) return;
            if (!isLoggedIn) {
              showInfoToast("Please log in to manage playlists.");
              return;
            }
            setDropDownOpen(true);
          }}
        >
          <i className="fa-solid fa-plus cursor-pointer text-white text-sm md:text-xl hover:text-green-400 transition" title="Add to playlist"></i>
        </DropdownTrigger>
        {isAuthReady && isLoggedIn &&
          <DropdownMenu
            aria-label="Dynamic Actions"
            className="bg-gray-700 rounded-md p-0 text-white min-w-36 shadow-xl shadow-gray-900/50"
            topContent={
              <div className="text-md font-medium bg-gray-800 rounded-t-md mb-2 text-white px-3 py-2">Your Playlists</div>
            }
          >
            <DropdownSection
              aria-label="playlists"
              items={playlists}
              className="max-h-36 overflow-y-auto scrollbar"
            >
              {(playlist) => {
                const songExists = playlist.songs.includes(songId);
                return (
                  <DropdownItem
                    key={playlist._id}
                    showDivider
                    className="flex items-center justify-between cursor-pointer px-4 py-2 hover:bg-gray-100/10 text-sm"
                    onClick={() => {
                      if (!songExists) {
                        addToPlaylist(playlist._id, playlist.playlistName);
                        showSuccessToast(`Added song to ${playlist.playlistName}`);
                      } else {
                        setSelectedPlaylist(playlist);
                        onOpen(); // open modal
                      }
                    }}
                  >
                    <div className="flex items-center justify-between w-full gap-x-2">
                      <span className="truncate">{playlist.playlistName}</span>
                      {songExists && <FiCheckCircle className="w-4 h-4 text-green-400" />}
                    </div>
                  </DropdownItem>
                );
              }}
            </DropdownSection>

            <DropdownSection className="mb-0">
              <DropdownItem className="bg-gray-800 pb-2 rounded-b-md">
                <button
                  className="w-full flex items-center justify-center text-sm bg-gray-500 hover:bg-gray-100/10 px-3 py-2 mt-2 rounded-md"
                  onClick={() => setIsCreateOpen(true)}

                >
                  <FiPlus className="w-4 h-4" />
                  <span>Create</span>
                </button>
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>}
      </Dropdown>

      <RemoveSongModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        selectedPlaylist={selectedPlaylist}
        handleRemove={handleRemove}
      />

      <CreatePlaylistModal
        isOpen={isCreateOpen}
        onOpenChange={() => setIsCreateOpen(false)}
        newPlaylistName={newPlaylistName}
        setNewPlaylistName={setNewPlaylistName}
        onCreate={(onClose) => {
          if (!newPlaylistName.trim()) return;
          if (playlists.some(p => p.playlistName === newPlaylistName.trim())) {
            showErrorToast("Playlist with this name already exists.");
            return;
          }
          dispatch(createPlaylistThunk({ playlistName: newPlaylistName, userId: userDetails._id, songId }));
          setNewPlaylistName('');
          setIsCreateOpen(false);
          onClose();
        }}
      />
    </>
  );
};



export default PlaylistPopover;
