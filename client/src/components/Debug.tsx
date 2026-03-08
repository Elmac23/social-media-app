"use client";

import React from "react";
import { useAuth } from "./AuthProvider";

function Debug() {
  const { accessToken, user } = useAuth(false);
  return (
    <div>
      <p>TOKEN: {accessToken}</p>
      <p>USER: {JSON.stringify(user?.role)}</p>
    </div>
  );
}

export default Debug;
