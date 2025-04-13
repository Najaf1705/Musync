import React from 'react';

const VideoCard = ({ video, isSelected, onSelect }) => {
  return (
    <div
      className={`video-item card mb-3 mx-2 curpoint ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(video)}
    >
      <img
        src={video.snippet.thumbnails.default.url}
        alt={video.snippet.title}
        className="card-img-top pt-2"
      />
      <div className="card-body">
        <h5 className="card-title">{video.snippet.title}</h5>
      </div>
    </div>
  );
};

export default VideoCard;