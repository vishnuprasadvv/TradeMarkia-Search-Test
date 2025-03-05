import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-[12px]">
      <div className="flex items-center relative">
        <FiSearch className="absolute mx-3 size-5 text-[#636363]" />
        <input
          type="text"
          placeholder="Search Trademark Here eg. Mickey Mouse"
          className="w-[455px] h-[50px] border-1 border-[#D4D4D4] rounded-xl bg-white pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="h-[50px] w-[124px] rounded-xl text-white  font-gilroy-regular font-bold bg-[#4380EC]"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
