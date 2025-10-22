"use client";

import SearchElement from "@/components/search/SearchElement";
import Button from "@/components/ui/Button";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { clearSearches, useSearches } from "@/store/searches";
import React from "react";
import { MdDelete } from "react-icons/md";

function SearchList() {
  const searches = useSearches();
  const dispatch = useAppDispatch();
  return (
    <>
      <Button
        icon={<MdDelete />}
        onClick={() => dispatch(clearSearches())}
        className="mb-4"
      >
        Clear All
      </Button>
      <ul className="flex flex-col items-stretch space-y-2">
        {searches.map((search) => (
          <li key={search.id}>
            <SearchElement search={search} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default SearchList;
