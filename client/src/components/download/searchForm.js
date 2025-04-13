import React from 'react';

const SearchForm = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="input-group mt-3 d-flex justify-content-center">
      <input
        id="inp"
        type="text"
        className="form-control-md"
        placeholder="Search for videos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="input-group-append mx-2">
        <button className="" type="submit" onClick={handleSubmit}>
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;