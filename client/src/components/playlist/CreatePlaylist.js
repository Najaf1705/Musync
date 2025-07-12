import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/features/userSlice';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@heroui/react';

const CreatePlaylist = ({ isOpen, onOpenChange }) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const [playlistName, setPlaylistName] = useState('');

  const handleCreate = async () => {
    const trimmedName = playlistName.trim();
    if (!trimmedName) {
      showErrorToast("Playlist name cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/create-playlist/${trimmedName}/${userDetails._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        showErrorToast(`${trimmedName} already exists, choose another name`);
      } else {
        const newPlaylist = await response.json();

        const updatedUserDetails = {
          ...userDetails,
          playlists: [...userDetails.playlists, newPlaylist],
        };

        dispatch(setUser(updatedUserDetails));
        showSuccessToast(`Playlist "${trimmedName}" created successfully`);
        onOpenChange(false); // close modal
        setPlaylistName('');
      }
    } catch (error) {
      console.error("Can't create playlist", error);
      showErrorToast("Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="opaque"
      classNames={{
        body: "py-4",
        backdrop: "bg-black/80 backdrop-opacity-40",
        base: "border-[#1f1f1f] bg-[#121212] text-[#e0e0e0]",
        closeButton: "hover:bg-white/5 active:bg-white/10 top-2 right-2",
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="text-white font-semibold text-xl pt-4 pb-0">Create Playlist</ModalHeader>

            <ModalBody className="flex flex-col gap-3">
              <Input
                autoFocus
                isRequired
                placeholder="Enter playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                classNames={{
                  input: "text-white",
                  mainWrapper: "bg-[#1e1e1e]",
                  inputWrapper: "border border-gray-600 bg-[#1e1e1e]",
                }}
              />
            </ModalBody>

            <ModalFooter className="flex justify-end items-center gap-4">
              <Button variant="light" onPress={onCloseModal}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onPress={() => {
                  handleCreate();
                  // Don't close unless successful
                }}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreatePlaylist;
