"use client";

import React from "react";
import Typography from "../ui/Typography";
import { useSearches } from "@/store/searches";
import Link from "next/link";
import SearchElement from "./SearchElement";
import { useDropdown } from "../ui/dropdown";

function RecentSearches() {
  const searches = useSearches();
  const { close } = useDropdown();

  return (
    <div>
      <Typography className="p-2" bold>
        Recent searches
      </Typography>
      <div className="flex flex-col items-stretch space-y-2 max-h-80 overflow-y-auto px-2">
        {searches.length === 0 && (
          <div className="p-4 text-center">
            <Typography size="sm" color="muted">
              No recent searches
            </Typography>
          </div>
        )}

        {searches.length !== 0 && (
          <>
            {searches.slice(0, 5).map((search) => (
              <SearchElement key={search.id} search={search} />
            ))}
            <Link
              onClick={close}
              className="mt-2 text-center text-primary-500 hover:text-primary-400"
              href={"/searches"}
            >
              Show more
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default RecentSearches;
