import React from 'react';
import VideoCard from './videoCard';

const VideoList = ({ videos, selectedVideo, onVideoSelect }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="col-md-12">
      <div className="card-deck row d-flex justify-content-center my-4 pb-3">
        {videos.map((video) => (
          <VideoCard
            key={video.id.videoId}
            video={video}
            isSelected={
              selectedVideo && selectedVideo.id.videoId === video.id.videoId
            }
            onSelect={onVideoSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoList;