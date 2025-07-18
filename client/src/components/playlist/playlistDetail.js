import React, { useState } from 'react';
import SongCard from '../common/songCard';
import CustomPagination from "../common/CustomPagination"; // <-- import here
import { useNavigate } from 'react-router-dom';


function PlaylistDetail({ selectedPlaylistData, setDisplaySongs, selectedPlaylistSongsData, loading }) {
  const navigate=useNavigate();
  console.log("selectedPlaylistData", selectedPlaylistData);
  console.log("selectedPlaylistSongsData", selectedPlaylistSongsData);

  const [songPage, setSongPage] = useState(1);
  const SONGS_PER_PAGE = 10;
  const songs = selectedPlaylistSongsData || [];
  const totalPages = Math.ceil(songs.length / SONGS_PER_PAGE);
  const paginatedSongs = songs.slice((songPage - 1) * SONGS_PER_PAGE, songPage * SONGS_PER_PAGE);


  return (
    <>
      {/* Title and Close Icon Row */}
      <div className="flex items-center mt-6 mb-8">
        <i
          className="fa-solid fa-xmark fa-xl cursor-pointer text-white hover:text-red-500 mr-4 mt-1"
          onClick={() => setDisplaySongs(false)}
          title="Close"
        ></i>
        <h2 className="text-2xl font-semibold">
          {selectedPlaylistData.name}
        </h2>
      </div>

      <div className="flex flex-wrap justify-center mx-1">
        {loading ? (
          // Skeleton loader for loading state
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-40 sm:w-56 h-64 bg-gray-700 animate-pulse rounded-lg m-2"
            ></div>
          ))
        ) : selectedPlaylistSongsData.length > 0 ? (
          paginatedSongs.map((item, index) => (
            <SongCard key={item.id} item={item} index={index} />
          ))
        ) : (
          <div className='flex flex-col items-center justify-center w-full h-64'>
            <h3
              className="flex justify-center w-full pt-36 text-lg text-gray-500"
            >
              You have not added any songs yet
            </h3>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-sm hover:bg-green-600 transition"
              onClick={() => navigate('/')}
            >Add Songs
            </button>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center my-4">
          <CustomPagination
            className=" backdrop-blur-sm rounded-md bg-white/10"
            page={songPage}
            onChange={setSongPage}
            total={totalPages}
          />
        </div>
      )}
    </>
  );
}

export default PlaylistDetail;