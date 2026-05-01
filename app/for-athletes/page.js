"use client";

import Link from "next/link";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function ForAthletesPage() {
  return (
    <div className="section marketing-page">
      <div className="container">
        <div className="eyebrow dark">For Athletes</div>
        <Title>Free resources for athletes navigating recruiting and transfer decisions</Title>
        <Paragraph className="lead">
          Build a stronger recruiting profile, understand the transfer process, and access practical
          guidance designed for student-athletes.
        </Paragraph>
        <Paragraph className="lead">
          Looking for coaching-focused tools instead? <Link href="/hs-coaches">Visit the HS Coaches page</Link>.
        </Paragraph>
      </div>
    </div>
  );
}
