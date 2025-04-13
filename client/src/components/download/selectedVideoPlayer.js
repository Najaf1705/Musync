import React from 'react';

const SelectedVideoPlayer = ({ video, isVisible, onClose, onDownload }) => {
  if (!isVisible || !video) return null;

  return (
    <div className="col-md-6">
      <div className="selected-video-container d-flex justify-content-center align-items-center">
        <div className="floating-video">
          <button className="-danger vidclosebt" onClick={onClose}>
            X
          </button>
          <iframe
            title="Selected Video"
            className="responsive-iframe"
            width="100%"
            height="222"
            src={`https://www.youtube.com/embed/${video.id.videoId}`}
            frameBorder="0"
            allowFullScreen
          />
          <button className="w-50" onClick={onDownload}>
            Download Song
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedVideoPlayer;