import React from 'react'

function searchedPlaylistDetails({selectedPlaylistData}) {
   // console.log("Selected Playlist Data:", selectedPlaylistSongsData);
  return (
    <>
      {/* Title and Close Icon Row */}
      <div className="flex items-center mt-6 mb-8">
        <i
          className="fa-solid fa-xmark fa-xl cursor-pointer text-gray-500 hover:text-red-500 mr-4 mt-1"
          onClick={() => setDisplaySongs(false)}
          title="Close"
        ></i>
        <h2 className="text-2xl font-semibold">
          {selectedPlaylistData.name}
        </h2>
      </div>

      <div className="flex flex-wrap justify-center mx-1">
        {selectedPlaylistSongsData.length > 0 ? (
          selectedPlaylistSongsData.map((item, index) =>
            item.id &&
              item.album?.images[0]?.url &&
              item.name &&
              item.artists ? (
              <SongCard item={item} index={index} key={item.id} />
            ) : null
          )
        ) : (
          <h3
            className="flex justify-center w-full pb-12 text-lg text-gray-500"
          >
            You have not added any songs yet
          </h3>
        )}
      </div>
    </>
  )
}

export default searchedPlaylistDetails