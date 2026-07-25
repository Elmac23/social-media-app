import React from "react";

function JSONDebug({ data }: { data: unknown }) {
  return (
    <pre className="fixed left-0 bottom-0 size-100 bg-gray-700">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default JSONDebug;
