import React from 'react';

const SelectedVideoPlayer = ({ video, isVisible, onClose, onDownload }) => {
  if (!isVisible || !video) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 relative w-full max-w-lg">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold rounded-full px-2 py-1 transition"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          <iframe
            title="Selected Video"
            className="rounded-lg mb-4"
            width="100%"
            height="222"
            src={`https://www.youtube.com/embed/${video.id.videoId}`}
            frameBorder="0"
            allowFullScreen
          />
          <button
            className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition"
            onClick={onDownload}
          >
            Download Song
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedVideoPlayer;