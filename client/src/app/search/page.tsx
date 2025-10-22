import React from "react";

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string }>;
};

async function SearchPage({ searchParams }: SearchPageProps) {
  const { query } = await searchParams;
  return <div>{query}</div>;
}

export default SearchPage;
