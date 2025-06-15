import React from "react";
import SongCard from "../songCard";

const TopSongs = ({ topSongs }) => {
  return (
    <div>
      <h3 className="mt-2 text-xl font-semibold">Top Songs</h3>
      <div className="flex flex-wrap justify-center mx-1">
        {topSongs && topSongs.length > 0 ? (
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