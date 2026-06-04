"use client";

import { useMemo } from "react";
import { Typography } from "antd";
import { getProductWorkflowShowcasesForSport } from "../../lib/product-workflow-showcases";
import { useSportSelection } from "../SportSelectionProvider";
import ProductWorkflowMedia from "./ProductWorkflowMedia";

const { Title } = Typography;

const PLATFORM_BENEFITS = [
  {
    title: "Find the Right Players Faster",
    body: "Instantly identify athletes that fit your roster, system, and needs — without wasting hours sorting through disconnected information.",
    icon: "⌕",
  },
  {
    title: "Organize & Eliminate Chaos",
    body: "Stop bouncing between spreadsheets, tabs, and texts. Keep your entire recruiting process in one organized system built for coaches.",
    icon: "▦",
  },
];

export default function ProductPageContent() {
  const { sport } = useSportSelection();

  const workflowCards = useMemo(() => getProductWorkflowShowcasesForSport(sport), [sport]);
  const workflowCardCount = workflowCards.length;

  return (
    <div className="section marketing-page product-page">
      <div className="container">
        <section
          id="product-replace"
          className="product-block product-surface-blue product-replace-hero"
        >
          <Title level={2} className="headline-match-pricing">
            From Scattered to Streamlined
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
          {!sport ? (
            <p className="product-workflow-sport-hint lead">
              Select your sport above to see the workflow tools built for your program.
            </p>
          ) : null}
          <div className="product-workflow-showcases">
            {workflowCards.map((item, index) => (
              <article className="product-workflow-card" key={item.id}>
                <div className="product-workflow-media">
                  <ProductWorkflowMedia
                    showcase={item}
                    index={index}
                    total={workflowCardCount}
                  />
                </div>
                <div className="product-workflow-copy">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <ul className="tier-list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
