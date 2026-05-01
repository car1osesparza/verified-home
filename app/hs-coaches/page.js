"use client";

import Link from "next/link";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function HsCoachesPage() {
  return (
    <div className="section marketing-page">
      <div className="container">
        <div className="eyebrow dark">For HS Coaches</div>
        <Title>Support your athletes with clearer recruiting visibility and better guidance</Title>
        <Paragraph className="lead">
          Access tools and information that help high school coaches support athlete exposure,
          communication, and transfer-readiness.
        </Paragraph>
        <Paragraph className="lead">
          Looking for athlete-specific resources? <Link href="/for-athletes">Go to For Athletes</Link>.
        </Paragraph>
      </div>
    </div>
  );
}
