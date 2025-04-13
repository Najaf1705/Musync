import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { toggleLikeSong } from '../../redux/features/songSlice';
import { setCardColors, setCardTextColors } from '../../redux/features/songSlice';

const SongCard = ({ item, index }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const userDetails = useSelector(state => state.user.userDetails);
  const cardColors = useSelector(state => state.songs.cardColors);
  const cardTextColors = useSelector(state => state.songs.cardTextColors);
  const isLiked = userDetails?.likedSongs?.includes(item.id);

  if (!item || !item.name || !item.artists) {
    return null; // Or return a placeholder/loading state
  }

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Please login first!");
      return;
    }

    try {
      await dispatch(toggleLikeSong(item.id)).unwrap();
      toast.success(isLiked ? "Removed from Liked Songs" : "Added to Liked Songs");
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };

  const handleColors = (colors) => {
    if (colors?.[0]) {
      const dominantColor = colors[0];
      const brightness = 128; // Placeholder for brightness calculation
      // const brightness = calculateBrightness(dominantColor);
      const textColor = brightness > 128 ? "#000000" : "#FFFFFF";

      dispatch(setCardColors({ index, color: dominantColor }));
      dispatch(setCardTextColors({ index, color: textColor }));
    }
  };

  return (
    <div
      className="card col-5 col-md-4 col-lg-3 mb-3 mx-2"
      style={{
        backgroundColor: cardColors[index] || "",
        color: cardTextColors[index] || "",
      }}
    >
      <div style={{ minHeight: "8rem", minWidth: "100%" }}>
        <img
          loading="lazy"
          src={item.album?.images[0]?.url}
          className="card-img-top pt-2"
          alt={item.name || 'Song'}
        />
      </div>
      <div className="card-body">
        <p className="card-text">
          {(item.name || 'Unknown').slice(0, 30)} -{" "}
          {item.artists
            ? item.artists.map((artist) => artist.name || 'Unknown Artist').join(", ").slice(0, 30)
            : 'Unknown Artist'}
        </p>
        <div className="d-flex justify-content-around mt-2">
          <i
            className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart curpoint`}
            onClick={handleLike}
            style={{ color: isLiked ? 'red' : cardTextColors[index] || '' }}
          ></i>
          <i
            className="fa-solid fa-plus curpoint"
            // onClick={() => isLoggedIn ? setPlaylistModal(true) : toast.error("Please login first!")}
            title="Add to playlist"
          ></i>
          <i
            className="fa-solid fa-download curpoint"
            // onClick={() => handleDownload(item)}
            title="Download"
          ></i>
        </div>
      </div>
    </div>
  );
};

export default SongCard;