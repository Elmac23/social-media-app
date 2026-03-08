import React from "react";

async function AdminLayout({ children }: React.PropsWithChildren) {
  return <main className="max-w-[1500px] mx-auto p-8 ">{children}</main>;
}

export default AdminLayout;
