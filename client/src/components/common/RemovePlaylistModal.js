import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

const RemovePlaylistModal = ({
  isOpen,
  onOpenChange,
  playlistName,
  handleDeletePlaylist,
}) => (
  <Modal
    backdrop="opaque"
    placement="center"
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
    className="bg-gray-800 text-white rounded-lg shadow-lg"
  >
    <ModalContent>
      {(onCloseModal) => (
        <>
          <ModalHeader className="text-red-500 font-semibold text-xl pt-4 pb-0">
            Delete playlist?
          </ModalHeader>
          <ModalBody>
            <p>
              {`Are you sure you want to delete `}
              <strong>{playlistName}</strong>?
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-end items-center gap-4 p-4">
            <Button onPress={onCloseModal}>Cancel</Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white rounded-md p-2"
              onPress={() => {
                handleDeletePlaylist();
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
);

export default RemovePlaylistModal;