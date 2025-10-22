import Typography from "@/components/ui/Typography";
import React from "react";
import SearchList from "./SearchList";

function SearchesPage() {
  return (
    <main className="max-w-7xl mx-auto p-8">
      <Typography as="h1" size="2xl" bold className="mb-2">
        Searches
      </Typography>
      <Typography className="mb-4" color="muted">
        This is where you can view and manage your searches.
      </Typography>
      <SearchList />
    </main>
  );
}

export default SearchesPage;
