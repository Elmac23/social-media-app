"use client";

import { persistor, store } from "@/store";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function StoreProvider({ children }: React.PropsWithChildren) {
  return (
    <Provider store={store}>
      {" "}
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

export default StoreProvider;
