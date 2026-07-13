import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikeSongThunk } from '../../redux/features/song/songThunks';
import { Vibrant } from "node-vibrant/browser";
import { showErrorToast, showSuccessToast, showInfoToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import PlaylistPopover from './PlaylistPopover';
import { setDownloadQuery } from "../../redux/features/downloadSlice";

const SongCard = ({ item, index }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { user: userDetails, isAuthenticated, isAuthLoading } = useSelector((state) => state.auth);
  const userPlaylists = useSelector(state => state.songs.userPlaylists);
  const likedSongs = userPlaylists?.find(playlist => playlist.playlistName === "Liked Songs")?.songs || [];
  const [isLiked, setIsLiked] = useState(likedSongs?.includes(item.id));
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeThrottled, setLikeThrottled] = useState(false);

  // Local state for colors
  const [bgColor, setBgColor] = useState("#181818");
  const [textColor, setTextColor] = useState("#fff");

  useEffect(() => {
    setIsLiked(likedSongs?.includes(item.id));
  }, [likedSongs, item.id]);

  useEffect(() => {
    if (item.image) {
      Vibrant.from(item.image)
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
  }, [item]);

  const handleLike = async () => {
    if (!isAuthLoading && !isAuthenticated) {
      showInfoToast("Please log in to like songs.");
      return;
    }
    if (likeLoading) return;

    if (!likeThrottled) {
      setLikeThrottled(true);
      setLikeLoading(true);
      try {
        setIsLiked(!isLiked); // Optimistically update the like state
        isLiked ? showSuccessToast("Song unliked") : showSuccessToast("Song liked");
        const resultAction = await dispatch(toggleLikeSongThunk(item.id));
        if (toggleLikeSongThunk.fulfilled.match(resultAction)) {
          setIsLiked(resultAction.payload.isLiked);
        } else {
          showErrorToast("Failed to toggle like");
          setIsLiked(isLiked); // Revert optimistic update on error
        }
      } catch {
        showErrorToast("Like toggle failed.");
      } finally {
        setTimeout(() => {
          setLikeThrottled(false)
          setLikeLoading(false);
        }, 2000); // 2 seconds throttle
      }
    }
  };

  if (!item || !item.songName || !item.artists) return null;

  return (
    <div
      className="rounded-md md:rounded-l overflow-hidden w-40 md:w-56 shadow-lg flex m-2 p-1 md:p-2 flex-col transition-shadow hover:shadow-2xl bg-neutral-900"
      style={{ backgroundColor: bgColor, color: textColor }}
      title={`${item.songName} - ${item.artists ? item.artists?.primaryArtist[0]?.name : "Unknown Artist"}`}
    >
      <div className="relative aspect-square w-full">
        <img
          loading="lazy"
          src={item.image}
          className="w-full h-full object-cover rounded-t-md md:rounded-t-l"
          alt={item.songName || 'Song'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center">
          <div className="flex gap-5 mb-4">
            <i
              className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart cursor-pointer text-white text-sm md:text-xl hover:text-green-400 transition`}
              onClick={likeLoading ? undefined : handleLike}
              title={isLiked ? "Unlike" : "Like"}
            ></i>

            <PlaylistPopover
              songId={item.id}
            />

            <i
              className="fa-solid fa-download cursor-pointer text-white text-sm md:text-xl hover:text-green-400 transition"
              title="Download"

              onClick={() => {
                dispatch(setDownloadQuery(item.songName));
                navigate('/download');
              }}
            ></i>

            <i
              className="fa-brands fa-spotify cursor-pointer text-white text-sm md:text-xl hover:text-green-400 transition"
              title="Open on Spotify"
              onClick={() => {
                window.open(`https://open.spotify.com/track/${item.id}`, '_blank');
              }}
            ></i>
          </div>
        </div>
      </div>
      <div className="px-1 py-2 md:px-1 md:pt-2">
        <div
          className="font-semibold text-sm md:text-sm truncate"
          style={{ color: textColor }}
        >
          {item.songName || 'Unknown'}
        </div>
        <p className="text-xs sm:text-sm truncate">
          {`${item.artists ? item.artists?.primaryArtist[0]?.name : "Unknown Artist"}`}
        </p>
      </div>
    </div>
  );
};

export default SongCard;