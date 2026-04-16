export function transformSong(data) {
  return {
    id: data.id,
    name: data.name,
    album: data.album,
    images: data.image ?? [],
    artists: {
      primary: data.artists?.primary ?? [],
      all: data.artists?.all?.map((artist) => ({
        id: artist.id,
        name: artist.name,
        images: artist.image ?? []
      })) ?? []
    }
  };
}

export function transformPlaylist(data) {
  return {
    id: data.id,
    name: data.name,
    songs: data.songs?.map((song) => transformSong(song)) ?? [],
    images: data.image ?? [],
  };
}