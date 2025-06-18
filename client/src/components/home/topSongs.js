import React from "react";
import SongCard from "../songCard";

const TopSongs = ({ topSongs, loading }) => {
  return (
    <div>
      <h3 className="mt-2 text-xl font-semibold">Top Songs</h3>
      <div className="flex flex-wrap justify-center mx-1">
        {loading ? (
          // Skeleton loader for loading state
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-40 sm:w-56 h-64 bg-gray-700 animate-pulse rounded-lg m-2"
            ></div>
          ))
        ) : topSongs && topSongs.length > 0 ? (
          topSongs.map((item, index) => (
            <SongCard
              key={item.id}
              item={item}
              index={index}
            />
          ))
        ) : (
          <h3 className="flex justify-center w-full pb-12 text-lg text-gray-500">
            Top Songs will appear here
          </h3>
        )}
      </div>
    </div>
  );
};

export default TopSongs;