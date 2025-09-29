import React from "react";

function JSONDebug({ data }: { data: unknown }) {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default JSONDebug;
