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
    <form onSubmit={handleSubmit} className="input-group d-flex justify-content-center mt-1">
      <input
        type="text"
        className="form-control-md"
        placeholder="Enter Song Name"
        value={songName}
        required
        onChange={(e) => setSongName(e.target.value)}
      />
      <div className="input-group-append mx-2">
        <button className="" type="submit">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;