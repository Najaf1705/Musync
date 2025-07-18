import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@heroui/react";

const SelectedVideoPlayer = ({ video, isVisible, onClose, onDownload }) => {
  if (!video) return null;

  return (
    <Modal
      backdrop="opaque"
      placement="center"
      isOpen={isVisible}
      onOpenChange={onClose}
      classNames={{
        body: "py-6",
        backdrop: "bg-black/80 backdrop-opacity-40 backdrop-blur-md",
        base: "border-[#1f1f1f] bg-gray-600 text-[#e0e0e0] rounded-lg shadow-lg",
        closeButton: "hover:bg-white/5 active:bg-white/10 top-2 right-2",
      }}

    >
      <ModalContent>
        {(onCloseFn) => (
          <>
            <ModalHeader className="text-white font-semibold text-xl pt-4 pb-0">
              {video.snippet.title}
            </ModalHeader>
            <ModalBody className="flex flex-col items-center">
              <iframe
                title="Selected Video"
                className="rounded-lg"
                width="100%"
                height="222"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                allowFullScreen
              />
            </ModalBody>
            <ModalFooter className="flex justify-center pb-6 pt-0">
              <Button
                onPress={onDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2"
              >
                Download Song
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SelectedVideoPlayer;
