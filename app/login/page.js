"use client";

import { useEffect } from "react";
import { APP_LOGIN_URL } from "../../lib/external-links";

export default function LoginPage() {
  useEffect(() => {
    window.location.replace(APP_LOGIN_URL);
  }, []);

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 520, textAlign: "center" }}>
        <p style={{ margin: 0, color: "#4c617f" }}>Redirecting to Verified Athletics…</p>
      </div>
    </div>
  );
}
