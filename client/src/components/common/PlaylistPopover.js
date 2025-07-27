import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiPlus } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { addSongToPlaylistThunk, createPlaylistThunk, removeSongFromPlaylistThunk } from '../../redux/features/song/songThunks';
import { showSuccessToast } from '../utils/toast';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';

const PlaylistPopover = ({ setIsPopoverOpen, songId }) => {
  const dispatch = useDispatch();
  const playlists = useSelector(state => state.songs.userPlaylists)?.filter(p => p.playlistName !== "Liked Songs") || [];
  const userDetails = useSelector(state => state.user.user);

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');


  const addToPlaylist = (playlistId, playlistName) => {
    dispatch(addSongToPlaylistThunk({ playlistId, playlistName, userId: userDetails._id, songId }));
  };

  const handleRemove = () => {
    if (selectedPlaylist) {
      dispatch(removeSongFromPlaylistThunk({
        playlistId: selectedPlaylist._id,
        playlistName: selectedPlaylist.playlistName,
        userId: userDetails._id,
        songId
      }));
      showSuccessToast(`Removed song from ${selectedPlaylist.playlistName}`);
      setSelectedPlaylist(null);
    }
  };

  return (
    <>
      <Dropdown
        showArrow
        classNames={{
          base: 'before:bg-default-200',
          content: 'p-0 border-small border-divider bg-background',
        }}
      >
        <DropdownTrigger>
          <i className="fa-solid fa-plus cursor-pointer text-white text-xl hover:text-green-400 transition" title="Add to playlist"></i>
        </DropdownTrigger>

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
        </DropdownMenu>
      </Dropdown>

      {/* ✅ Modal for removal confirmation */}
      <Modal
        backdrop="opaque"
        placement='center'
        motionProps={{
          variants: {
            enter: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
            exit: { y: -20, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
          },
        }}
        classNames={{
          body: "py-6",
          backdrop: "bg-black/80 backdrop-opacity-40",
          base: "border-[#1f1f1f] bg-[#121212] text-[#e0e0e0]",
          closeButton: "hover:bg-white/5 active:bg-white/10 top-2 right-2",
        }}
        isOpen={isOpen}
        radius="sm"
        onOpenChange={onOpenChange}
        className='bg-gray-800 text-white rounded-lg shadow-lg'
      >
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="text-red-500 font-semibold text-xl pt-4 pb-0">Remove Song?</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to remove this song from <strong>{selectedPlaylist?.playlistName}</strong>?</p>
              </ModalBody>
              <ModalFooter
                className='flex justify-end items-center gap-4 p-4'
              >
                <Button onPress={onCloseModal}>
                  Cancel
                </Button>
                <Button
                  className='bg-green-600 hover:bg-green-700 text-white rounded-md p-2'
                  onPress={() => {
                    handleRemove();
                    onCloseModal();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        backdrop="opaque"
        placement='center'
        isOpen={isCreateOpen}
        onOpenChange={() => setIsCreateOpen(false)}
        classNames={{
          body: "py-6",
          backdrop: "bg-black/80 backdrop-opacity-40",
          base: "border-[#1f1f1f] bg-[#121212] text-[#e0e0e0]",
          closeButton: "hover:bg-white/5 active:bg-white/10 top-2 right-2",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPlaylistName.trim()) return;
                console.log("Creating playlist:", newPlaylistName); // 🔁 Replace with Redux/Backend call
                dispatch(createPlaylistThunk({ playlistName: newPlaylistName, userId: userDetails._id, songId }));
                setNewPlaylistName('');
                setIsCreateOpen(false);
              }}
            >
              <ModalHeader className="text-white font-semibold text-xl pt-4 pb-0">
                Create New Playlist
              </ModalHeader>
              <ModalBody>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter playlist name"
                  autoFocus
                />
              </ModalBody>
              <ModalFooter className="flex justify-end items-center gap-4 p-4">
                <Button onPress={onClose}>Cancel</Button>
                <Button
                  type="submit"
                  className='bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2'
                >
                  Create
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

    </>
  );
};



export default PlaylistPopover;
