import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { toggleLikeSong } from '../redux/features/likeSlice';
import { Vibrant } from "node-vibrant/browser";

const SongCard = ({ item, index }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const likedSongs = useSelector(state => state.likes.likedSongs);
  const userDetails = useSelector(state => state.user.user);
  const [isLiked, setIsLiked] = useState(likedSongs?.includes(item.id));
  const [likeLoading, setLikeLoading] = useState(false);



  // Local state for colors
  const [bgColor, setBgColor] = useState("#fff");
  const [textColor, setTextColor] = useState("#000");

  // Extract colors using Vibrant when the image changes
  useEffect(() => {
    if (item.album?.images[0]?.url) {
      Vibrant.from(item.album.images[0].url)
        .getPalette()
        .then((palette) => {
          const dominantColor = palette.Vibrant?.hex || "#fff";
          setBgColor(dominantColor);
          const rgb = palette.Vibrant?.rgb || [255, 255, 255];
          const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
          setTextColor(brightness > 128 ? "#000" : "#fff");
        })
        .catch(() => {
          setBgColor("#fff");
          setTextColor("#000");
        });
    }
  }, [item.album]);



  if (!item || !item.name || !item.artists) {
    return null;
  }

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to like songs.");
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/toggle-like/${item.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: item.id }),
      });
      const data = await res.json();
      setIsLiked(data.isLiked);
      if (res.ok) {
        dispatch(toggleLikeSong(item.id));
        if (data.isLiked) {
          toast.success("Liked the song!");
        } else {
          toast.info("Unliked the song.");
        }
      }
    } catch (err) {
      console.error("Like toggle failed:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div
      className="card col-5 col-md-4 col-lg-3 mb-3 mx-2"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        transition: "background 0.3s, color 0.3s"
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
        <div className="song-title-marquee">
          <span>{(item.name || 'Unknown')}</span>
        </div>
        <p className="card-text">
          {item.artists
            ? item.artists.map((artist) => artist.name || 'Unknown Artist').join(", ").slice(0, 30)
            : 'Unknown Artist'}
        </p>
        <div className="d-flex justify-content-around mt-2">
          <i
            className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart curpoint`}
            onClick={likeLoading ? undefined : handleLike}
            style={{ pointerEvents: likeLoading ? 'none' : 'auto', opacity: likeLoading ? 0.5 : 1 }}
          ></i>
          <i
            className="fa-solid fa-plus curpoint"
            title="Add to playlist"
          ></i>
          <i
            className="fa-solid fa-download curpoint"
            title="Download"
          ></i>
        </div>
      </div>
    </div>
  );
};

export default SongCard;