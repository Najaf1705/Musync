import React from 'react';

const SearchForm = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      className="flex justify-center items-center gap-2 mt-3"
      onSubmit={handleSubmit}
    >
      <input
        id="inp"
        type="text"
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
        placeholder="Search for videos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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

export default SearchForm;