"use client";

import { useEffect, useState } from "react";

export default function LocalizedHomePage() {
  const [PageComponent, setPageComponent] = useState<any>(null);

  useEffect(() => {
    import("../page").then((mod) => {
      setPageComponent(() => mod.default);
    });
  }, []);

  if (!PageComponent) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <PageComponent />;
}
