"use client";

import { useEffect, useState } from "react";

export default function LocalizedAdminUsersPage() {
  const [PageComponent, setPageComponent] = useState<any>(null);

  useEffect(() => {
    import("../../../admin/users/page").then((mod) => {
      setPageComponent(() => mod.default);
    });
  }, []);

  if (!PageComponent) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <PageComponent />;
}
