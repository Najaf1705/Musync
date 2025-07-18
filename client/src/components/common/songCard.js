import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikeSong } from '../../redux/features/songSlice';
import { Vibrant } from "node-vibrant/browser";
import { showErrorToast, showSuccessToast, showInfoToast } from "../utils/toast";

import PlaylistPopover from './PlaylistPopover'


const SongCard = ({ item, index }) => {

  const dispatch = useDispatch();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const userPlaylists = useSelector(state => state.songs.userPlaylists);
  const likedSongs = userPlaylists?.find(playlist => playlist.playlistName === "Liked Songs")?.songs || [];
  const [isLiked, setIsLiked] = useState(likedSongs?.includes(item.id));
  const [likeLoading, setLikeLoading] = useState(false);

  // Local state for colors
  const [bgColor, setBgColor] = useState("#181818");
  const [textColor, setTextColor] = useState("#fff");

  useEffect(() => {
    setIsLiked(likedSongs?.includes(item.id));
  }, [likedSongs, item.id]);

  useEffect(() => {
    if (item.album?.images[0]?.url) {
      Vibrant.from(item.album.images[0].url)
        .getPalette()
        .then((palette) => {
          const dominantColor = palette.Vibrant?.hex || "#181818";
          setBgColor(dominantColor);
          const rgb = palette.Vibrant?.rgb || [24, 24, 24];
          const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
          setTextColor(brightness > 128 ? "#000" : "#fff");
        })
        .catch(() => {
          setBgColor("#181818");
          setTextColor("#fff");
        });
    }
  }, [item.album]);



  const handleLike = async () => {
    if (!isLoggedIn) {
      showInfoToast("Please log in to like songs.");
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    

    try {
      setIsLiked(!isLiked); // Optimistically update the like state
      isLiked ? showSuccessToast("Song unliked") : showSuccessToast("Song liked");
      const resultAction = await dispatch(toggleLikeSong(item.id));
      if (toggleLikeSong.fulfilled.match(resultAction)) {
        setIsLiked(resultAction.payload.isLiked);
      } else {
        showErrorToast("Failed to toggle like");
        setIsLiked(isLiked); // Revert optimistic update on error
      }
    } catch {
      showErrorToast("Like toggle failed.");
    } finally {
      setLikeLoading(false);
    }
  };

  if (!item || !item.name || !item.artists) return null;

  return (
    <div
      className="rounded-xl overflow-hidden w-40 sm:w-56 shadow-lg flex m-2 p-2 sm:p-3 flex-col transition-shadow hover:shadow-2xl bg-neutral-900"
      style={{ backgroundColor: bgColor, color: textColor }}
      title={`${item.name} - ${item.artists ? item.artists.map(a => a.name).join(", ") : "Unknown Artist"}`}
    >
      <div className="relative aspect-square w-full">
        <img
          loading="lazy"
          src={item.album?.images[0]?.url}
          className="w-full h-full object-cover"
          alt={item.name || 'Song'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center">
          <div className="flex gap-5 mb-4">
            <i
              className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart cursor-pointer text-white text-xl hover:text-green-400 transition`}
              onClick={likeLoading ? undefined : handleLike}
              // style={{ pointerEvents: likeLoading ? 'none' : 'auto', opacity: likeLoading ? 0.5 : 1 }}
              title={isLiked ? "Unlike" : "Like"}
            ></i>

            <PlaylistPopover
              setIsPopoverOpen={setIsPopoverOpen}
              songId={item.id}
            />

            <i className="fa-solid fa-download cursor-pointer text-white text-xl hover:text-green-400 transition" title="Download"></i>
            <i className="fa-brands fa-spotify cursor-pointer text-white text-xl hover:text-green-400 transition" title="Open on Spotify"
              onClick={() => {
                window.open(`https://open.spotify.com/track/${item.id}`, '_blank');
              }}
            ></i>
          </div>
        </div>
      </div>
      <div className="px-2 py-2 sm:px-4 sm:py-3">
        <div
          className="font-semibold text-sm sm:text-base truncate"
          style={{ color: textColor }}
        >
          {item.name || 'Unknown'}
        </div>
        <p
          className="text-xs sm:text-sm truncate"
        >
          {item.artists
            ? item.artists.map((artist) => artist.name || 'Unknown Artist').join(", ").slice(0, 30)
            : 'Unknown Artist'}
        </p>
      </div>
    </div>
  );
};

export default SongCard;