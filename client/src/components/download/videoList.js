import React from 'react';
import VideoCard from './videoCard';

const VideoList = ({ videos, selectedVideo, onVideoSelect }) => {
  if (!videos || videos.length === 0) return <p>No videos found</p>;

  return (
    <div className="w-full flex flex-wrap justify-center my-4 pb-3">
      {videos.map((video) => (
        <VideoCard
          key={video.videoId}
          video={video}
          isSelected={selectedVideo && selectedVideo.videoId === video.videoId}
          onSelect={onVideoSelect}
        />
      ))}
    </div>
  );
};


export default VideoList;