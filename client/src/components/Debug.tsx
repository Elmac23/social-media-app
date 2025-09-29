"use client";

import React from "react";
import { useAuth } from "./AuthProvider";

function Debug() {
  const { accessToken, user } = useAuth();
  return (
    <div>
      <p>TOKEN: {accessToken.substring(0, 10)}</p>
      <p>USER: {JSON.stringify(user)}</p>
    </div>
  );
}

export default Debug;
