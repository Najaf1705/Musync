import React, { useState, useEffect } from "react";

const SearchBar = (props) => {
  const {songName, setSongName, handleSubmit}=props;

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center mt-1 gap-2">
      <input
        type="text"
        className=" text-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 w-64 backdrop-blur-lg bg-white/20 placeholder:text-white"
        placeholder="Enter Song Name"
        value={songName}
        required
        onChange={(e) => setSongName(e.target.value)}
      />
      <button
        className="bg-gray-600/50 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-md transition"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;