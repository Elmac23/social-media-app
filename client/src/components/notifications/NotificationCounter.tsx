"use client";

import React from "react";

type NotificationCounterProps = {
  count: number;
};

function NotificationCounter({ count }: NotificationCounterProps) {
  if (count === 0) return null;

  if (count > 99) return <span>(99+)</span>;

  return <span>({count})</span>;
}

export default NotificationCounter;
