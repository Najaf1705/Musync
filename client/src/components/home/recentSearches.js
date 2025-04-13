import React from "react";

const RecentSearches = ({ recentSearches, handleRemoveRecent, setSongName }) => {
  return recentSearches.length > 0 ? (
    <div>
      <h6 style={{ paddingTop: ".5rem" }}>Recents</h6>
      <ul style={{ display: "flex", listStyle: "none", marginBottom: "0", padding: "0" }}>
        <div style={{ display: "flex", overflow: "auto" }}>
          {recentSearches.map((search, index) => (
            <li className="recents curpoint" key={index}>
              <i
                className="fa-solid fa-xmark curpoint"
                style={{ paddingRight: ".2rem" }}
                onClick={() => handleRemoveRecent(search)}
              ></i>
              <div onClick={() => setSongName(search)}>{search}</div>
            </li>
          ))}
        </div>
      </ul>
    </div>
  ) : null;
};

export default RecentSearches;