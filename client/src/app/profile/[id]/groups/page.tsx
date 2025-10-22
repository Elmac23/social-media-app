"use client";

import { useSocket } from "@/components/SocketProvider";
import Button from "@/components/ui/Button";

function GroupsPage() {
  const { socket } = useSocket();
  return (
    <div>
      <Button
        onClick={() => {
          socket?.emit("test");
        }}
      >
        TEST
      </Button>
    </div>
  );
}

export default GroupsPage;
