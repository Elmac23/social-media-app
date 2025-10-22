import { combineReducers, configureStore } from "@reduxjs/toolkit";
import searchesReducer from "./searches";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import notificationsCounterReducer from "./notificationsCount";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["searches"],
};

const rootReducer = combineReducers({
  searches: searchesReducer,
  notificationsCount: notificationsCounterReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
          "persist/PAUSE",
        ],
        ignoredActionsPaths: ["result", "register"],
        ignoredPaths: ["register"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
