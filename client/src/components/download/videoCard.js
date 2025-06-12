import React from 'react';

const VideoCard = ({ video, isSelected, onSelect }) => {
  return (
    <div
      className={`flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md m-2 p-3 w-56 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'}`}
      onClick={() => onSelect(video)}
    >
      <img
        src={video.snippet.thumbnails.default.url}
        alt={video.snippet.title}
        className="rounded-lg object-cover w-full h-32 mb-2"
      />
      <div className="text-center">
        <h5 className="font-semibold text-sm truncate">{video.snippet.title}</h5>
      </div>
    </div>
  );
};

export default VideoCard;