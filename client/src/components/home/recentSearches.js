import React from "react";

const RecentSearches = ({ recentSearches, handleRemoveRecent, setSongName, handleSubmit }) => {
  return recentSearches.length > 0 ? (
    <div>
      <h6 className="pt-2 text-base font-semibold">Recents</h6>
      <ul className="flex list-none mb-0 p-0 overflow-x-auto">
        {recentSearches.map((search, index) => (
          <li
            className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 mr-2 mb-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            key={index}
          >
            <i
              className="fa-solid fa-xmark text-gray-500 hover:text-red-500 mr-2 cursor-pointer"
              onClick={() => handleRemoveRecent(search)}
            ></i>
            <div
              className="text-gray-800 dark:text-gray-200"
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