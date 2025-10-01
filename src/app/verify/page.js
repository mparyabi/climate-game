// app/verify/page.js

import VerifyClient from "@/components/VerifyClient";


export default function VerifyPage({ searchParams }) {
  // دریافت مقادیر از query string
  const status = searchParams.Status;
  const authority = searchParams.Authority;

  return <VerifyClient status={status} authority={authority} />;
}
