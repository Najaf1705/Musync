import React from "react";

const RecentSearches = ({ recentSearches, handleRemoveRecent, setSongName, handleSubmit }) => {
  return recentSearches.length > 0 ? (
    <div>
      <h6 className="py-2 text-lg font-semibold">Recent searches</h6>
      <ul className="flex list-none mb-0 p-0 overflow-x-auto">
        {recentSearches.map((search, index) => (
          <li
            className="flex items-center bg-gray-300/30 rounded-full px-3 py-0 mr-2 mb-2 cursor-pointer hover:bg-gray-300/50  transition max-w-48"
            key={index}
            title={search}
          >
            <i
              className="fa-solid fa-xmark text-white hover:text-red-500 mr-2 cursor-pointer"
              onClick={() => handleRemoveRecent(search)}
            ></i>
            <div
              className="text-gray-800 dark:text-gray-200 truncate"
              onClick={() => {
                setSongName(search);
                handleSubmit(null, search);
              }}
            >
              {search}
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default RecentSearches;