jest.mock("axios", () => ({}));
const likeReducer = require("../redux/features/likeSlice").default;
const fetchLikedSongs = require("../redux/features/likeSlice").fetchLikedSongs;

describe("likeSlice reducer", () => {
  it("should handle fetchLikedSongs.fulfilled and add isLiked: true to each song", () => {
    const initialState = {
      likedSongs: [],
      likedPlaylists: [],
      status: "idle",
      error: null,
    };

    const mockSongs = [
      { id: 1, title: "Song 1" },
      { id: 2, title: "Song 2" },
    ];

    const action = {
      type: fetchLikedSongs.fulfilled.type,
      payload: mockSongs,
    };

    const state = likeReducer(initialState, action);

    expect(state.likedSongs).toEqual([
      { id: 1, title: "Song 1", isLiked: true },
      { id: 2, title: "Song 2", isLiked: true },
    ]);
    expect(state.status).toBe("succeeded");
  });
});