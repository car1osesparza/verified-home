"use client";

import Link from "next/link";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export function CoachesFooterSection() {
  return (
    <section className="coaches-block coaches-footer-transition" id="for-coaches">
      <Title level={3}>Not a college coach?</Title>
      <Paragraph className="coaches-body-copy">Choose the experience built for your role.</Paragraph>
      <div className="coaches-footer-links">
        <Link href="/for-athletes">For Athletes</Link>
        <Link href="/hs-coaches">For HS Coaches</Link>
      </div>
    </section>
  );
}

/** Standalone /for-coaches page: role routing CTA only. */
export default function ForCoachesPageContent() {
  return (
    <div className="section marketing-page coaches-page">
      <div className="container">
        <CoachesFooterSection />
      </div>
    </div>
  );
}
