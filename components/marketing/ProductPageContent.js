"use client";

import { Typography } from "antd";
import ProductWorkflowGif, {
  WORKFLOW_DEMO_CROPS,
  workflowDemoPhaseMs,
} from "./ProductWorkflowGif";

const { Title } = Typography;

const PLATFORM_MODULES = [
  {
    title: "Athlete Database",
    description: "Access a centralized database of high school and transfer athletes.",
    points: [
      "Position and location data",
      "Athlete profiles and contact information",
      "Ongoing updates as athletes move through recruiting cycles",
    ],
  },
  {
    title: "Transfer Database",
    description: "Stay ahead of athlete movement.",
    points: [
      "Track transfer activity across divisions",
      "Monitor updates as athletes enter or change status",
      "Identify opportunities earlier",
    ],
  },
  {
    title: "Alerts and Notifications",
    description: "Get notified when it matters.",
    points: ["Athlete status changes", "Offer activity", "New opportunities in your recruiting pipeline"],
  },
  {
    title: "AI Suggested Targets",
    description: "Surface athletes that fit your program.",
    points: [
      "Identify potential recruits based on available data",
      "Support recruiting board development",
      "Reduce time spent searching manually",
    ],
  },
  {
    title: "Measurables and Performance Data",
    description: "Evaluate athletes with consistent data points.",
    points: [
      "Physical measurables",
      "Performance metrics where available",
      "Structured data for comparison",
    ],
  },
  {
    title: "Verified Ratings",
    description: "Add context to evaluation.",
    points: ["Standardized ratings where available", "Additional signals to support decision-making"],
  },
  {
    title: "Pre-Portal and Emerging Data",
    description: "Identify athletes before they fully enter the recruiting cycle.",
    points: ["Early signals and emerging opportunities", "Additional context for transfer movement"],
  },
  {
    title: "Workflow Integrations",
    description: "Work within your existing systems.",
    points: [
      "Integration with recruiting workflows where applicable",
      "Support for tools used by college programs",
    ],
  },
];

const PLATFORM_BENEFITS = [
  {
    title: "Find what matters faster",
    body: "Locate the right athletes quickly without hunting across scattered lists and disconnected tools.",
    icon: "⌕",
  },
  {
    title: "Organize recruiting work",
    body: "Keep discovery, evaluation, and tracking in one structured workflow your full staff can use.",
    icon: "▦",
  },
  {
    title: "Share context instantly",
    body: "Coordinate decisions with shared visibility into updates, targets, and recruiting priorities.",
    icon: "⇆",
  },
  {
    title: "Protect staff time",
    body: "Reduce manual monitoring and administrative overhead so coaches can focus on recruiting.",
    icon: "⛨",
  },
];

const WORKFLOW_SHOWCASES = [
  {
    title: "Strategy to recruiting action",
    description:
      "Connect board priorities to real athlete targets so your staff can move from planning to execution without disconnected tools.",
    points: ["Prioritize by tier and position groups", "Track offers, movement, and assignment status in one view"],
  },
  {
    title: "Goals to staff accountability",
    description:
      "Give coaches a shared view of updates, movement, and next actions so everyone is aligned on where to focus every week.",
    points: ["Keep contact and eligibility context visible", "Review profile-level details without leaving workflow"],
  },
];

export default function ProductPageContent() {
  const workflowCards = [...WORKFLOW_SHOWCASES, ...PLATFORM_MODULES];
  const workflowCardCount = workflowCards.length;

  return (
    <div className="section marketing-page product-page">
      <div className="container">
        <section
          id="product-replace"
          className="product-block product-surface-blue product-replace-hero"
        >
          <Title level={2} className="headline-match-pricing">
            Replace fragmented workflows
          </Title>
          <div className="product-benefits-grid">
            {PLATFORM_BENEFITS.map((item) => (
              <article className="product-benefit-item" key={item.title}>
                <div className="product-benefit-icon" aria-hidden="true">
                  {item.icon}
                </div>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="product" className="product-block home-marketing-anchor">
          <Title level={3} className="headline-match-pricing">
            Built for the full recruiting workflow
          </Title>
          <div className="product-workflow-showcases">
            {workflowCards.map((item, index) => (
              <article className="product-workflow-card" key={item.title}>
                <div className="product-workflow-copy">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <ul className="tier-list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="product-workflow-media">
                  <ProductWorkflowGif
                    alt={`${item.title} — recruiting workflow`}
                    playbackIndex={index}
                    phaseMs={workflowDemoPhaseMs(index, workflowCardCount)}
                    objectPosition={WORKFLOW_DEMO_CROPS[index % WORKFLOW_DEMO_CROPS.length]}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
