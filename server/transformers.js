export function transformSong(data) {
  return {
    id: data.id,
    songName: data.name,
    album: data.album,
    image: data.image[2]?.url,
    playCount: data.playCount,
    artists: {
      primaryArtist: data.artists?.primary?.map((artist) => ({name: artist.name,})) ?? [],
      featuredArtists: data.artists?.featured?.map((artist) => ({name: artist.name,})) ?? []
    }
  };
}

export function transformPlaylist(data) {
  return {
    id: data.id,
    playlistName: data.name,
    playlistSongs: data.songs?.map((song) => transformSong(song)) ?? [],
    image: data.image[2]?.url,
  };
}