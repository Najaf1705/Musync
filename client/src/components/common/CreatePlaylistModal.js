import React, { useRef, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

const CreatePlaylistModal = ({
  isOpen,
  onOpenChange,
  newPlaylistName,
  setNewPlaylistName,
  onCreate,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Modal
      backdrop="opaque"
      placement="center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
              onCreate(onClose);
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
                ref={inputRef}
              />
            </ModalBody>
            <ModalFooter className="flex justify-end items-center gap-4 p-4">
              <Button onPress={onClose}>Cancel</Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2"
              >
                Create
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreatePlaylistModal;