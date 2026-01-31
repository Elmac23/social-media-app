import React from "react";

function JSONDebug({ data }: { data: unknown }) {
  return (
    <pre className="fixed inset-50 bg-gray-700">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default JSONDebug;
