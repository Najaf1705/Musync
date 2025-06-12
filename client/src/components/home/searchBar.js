import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { searchSongsAndPlaylists } from '../../redux/features/songSlice';
import { toast } from 'react-toastify';

const SearchBar = () => {
  const dispatch = useDispatch();
  const [songName, setSongName] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveRecentSearchesToLocalStorage = (searches) => {
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedSongName = songName.trim();
    
    if (!trimmedSongName) {
      toast.error('Please enter a song name');
      return;
    }

    try {
      // Update recent searches
      if (!recentSearches.includes(trimmedSongName)) {
        const updatedSearches = [trimmedSongName, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedSearches);
        saveRecentSearchesToLocalStorage(updatedSearches);
      }

      // Perform search
      await dispatch(searchSongsAndPlaylists(trimmedSongName)).unwrap();
    } catch (error) {
      toast.error('Failed to search songs');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center mt-1 gap-2">
      <input
        type="text"
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
        placeholder="Enter Song Name"
        value={songName}
        required
        onChange={(e) => setSongName(e.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;