"use client";

import { useEffect, useState } from "react";

export default function LocalizedAdminPaymentsPage() {
  const [PageComponent, setPageComponent] = useState<any>(null);

  useEffect(() => {
    import("../../../admin/payments/page").then((mod) => {
      setPageComponent(() => mod.default);
    });
  }, []);

  if (!PageComponent) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <PageComponent />;
}
