import { useAppSelector } from "@/hooks/reduxHooks";
import { CreateSearch, Search } from "@/types/search";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { searches: Search[] } = {
  searches: [],
};

export const searchesSlice = createSlice({
  name: "searches",
  initialState,
  reducers: {
    addSearch: (state, action: PayloadAction<CreateSearch>) => {
      state.searches.unshift({ ...action.payload, id: crypto.randomUUID() });
    },
    clearSearches: (state) => {
      state.searches = [];
    },
    removeSearch: (state, action: PayloadAction<string>) => {
      state.searches = state.searches.filter(
        (search) => search.id !== action.payload
      );
    },
  },
});
export const { addSearch, clearSearches, removeSearch } = searchesSlice.actions;
export default searchesSlice.reducer;

export const useSearches = () =>
  useAppSelector((state) => state.searches.searches);
