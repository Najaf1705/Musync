import React from "react";
import { useDispatch } from 'react-redux';
import { setSelectedPlaylist } from '../../redux/features/songSlice';

const PlaylistCard = ({ playlist }) => {
  const dispatch = useDispatch();

  const handlePlaylistSelect = () => {
    dispatch(setSelectedPlaylist({
      id: playlist.id,
      name: playlist.name
    }));
  };

  return (
    <div
      className="col-4 col-md-4 col-lg-2 mb-3 curpoint"
      onClick={handlePlaylistSelect}
    >
      <div style={{ minHeight: "6rem", minWidth: "100%" }}>
        <img
          loading="lazy"
          src={playlist.images[0]?.url}
          className="card-img-top pt-2"
          alt={playlist.name}
        />
      </div>
      <div className="card-body">
        <p className="card-text" style={{ fontSize: ".9rem", fontWeight: "600" }}>
          {playlist.name} - {playlist.owner.display_name}
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;