import React from "react";
import SongCard from "./songCard";

const TopSongs = ({ topSongs, cardColors, cardTextColors, setCardColors, setCardTextColors }) => {
  return (
    <div>
      <h3 className="mt-2">Top Songs</h3>
      <div className="row card-deck d-flex justify-content-center mx-">
        {topSongs && topSongs.length > 0 ? (
          topSongs.map((item, index) => (
            <SongCard
              key={item.id}
              item={item}
              index={index}
              cardColors={cardColors}
              cardTextColors={cardTextColors}
              setCardColors={setCardColors}
              setCardTextColors={setCardTextColors}
            />
          ))
        ) : (
          <h3 className="d-flex justify-content-center" style={{ paddingBottom: "3rem" }}>
            Top Songs will appear here
          </h3>
        )}
      </div>
    </div>
  );
};

export default TopSongs;