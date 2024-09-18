import React, { useState } from 'react';
import { IoSearch } from "react-icons/io5";



function SearchBar({ onSearch }) {



  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };




  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center max-w-sm mx-auto">
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full">

          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">

            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
            </svg>
          </div>

          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="p-[6px] ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <IoSearch className='text-2xl font-bold' />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
