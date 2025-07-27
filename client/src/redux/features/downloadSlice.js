import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  downloads: [],
  downloadQuery: "",
    downloadSearchResults: [],
}

const downloadSlice = createSlice({
    name: "download",
    initialState,
    reducers: {
        setDownloadQuery: (state, action) => {
            state.downloadQuery = action.payload;
        },
        setDownloadSearchResults: (state, action) => {
            state.downloadSearchResults = action.payload;
        }
    }
});

export const { setDownloadQuery, setDownloadSearchResults } = downloadSlice.actions;
export default downloadSlice.reducer;