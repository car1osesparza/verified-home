"use client";

import Link from "next/link";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const FOUNDERS = [
  {
    name: "Nathan Slutzky",
    role: "CHIEF EXECUTIVE OFFICER (CEO), CO-FOUNDER",
    bio: "Nate brings a unique combination of skills and experience as a College Football Coach and Data Analytics Expert delivering value and strategic thinking to the College Athletics Recruiting Process. Nate is an expert in Data Analytics, Machine Learning (ML), and Artificial Intelligence (AI) with diverse experience working for Bridgewater Associates. Prior to co-founding Verified Athletics, Nate spent 10 years as a College Football Coach at Rutgers, the University of Colorado, Fordham, and Albright.",
    image:
      "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/e6c3da00-8509-40a3-8c5d-aa185336ae9b/nate_fix.png",
  },
  {
    name: "Damir Makic",
    role: "CHIEF OPERATING OFFICER (COO), CO-FOUNDER",
    bio: "Prior to co-founding Verified Athletics, Damir spent over eight years in middle market investment banking. Damir brings 15 years of corporate financial data analysis and finance expertise including M&A and equity private placements, and helps lead the company's operational and strategic growth.",
    image:
      "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/9f18d8c0-edf9-4de9-8f5c-8c59a286bae0/damir_fix.png",
  },
];

const TEAM = [
  {
    name: "Andrew Gruesser",
    role: "Director of Sales and Customer Success, All Sports",
    image:
      "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/40cd50fa-1a2b-4cb5-961b-2008a9eab174/AndrewG_fix.png",
  },
  {
    name: "Shane Fogarty",
    role: "Director of Sales and Customer Success, Football",
    image:
      "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/330f748b-eeed-4a70-bf63-5349c2f2cf5d/shane_fix.png",
  },
  {
    name: "Patty Maye Ohanian",
    role: "Director of Sales, Customer Success & Company Community",
    image:
      "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/8aabe0cb-8d17-4c4b-bd57-bc08c3b49335/Patty_fix.png",
  },
  {
    name: "Danny Marx",
    role: "Head of Technology",
    image:
      "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/7aa9cd73-f786-4331-9131-f7869e6819e0/Danny_fix.png",
  },
  {
    name: "Erikka Makic",
    role: "Head of Data Management",
    image:
      "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/41df958f-988f-4a34-9c74-b45b0bc6ea96/Erikka_fix.png",
  },
  {
    name: "Robert Quinn",
    role: "Head of Database Operations",
    image:
      "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/381bbf4f-8980-4d29-bb5e-24f15c479e02/Robert_fix.jpg",
  },
  {
    name: "Sam Boyer",
    role: "Senior Data Analyst",
    image:
      "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/1ce7afe2-ebc7-4b5d-9e8b-b2808fadc7f1/SamB_fix.png",
  },
  {
    name: "Katie Nepil",
    role: "Data Analyst",
    image:
      "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/acf67642-024d-48e8-ace3-244b01fb2405/Gemini_Generated_Image_28jli628jli628jl+cropped.png",
  },
];

export default function AboutPage() {
  return (
    <div className="section marketing-page about-page">
      <div className="container about-main">
        <div className="eyebrow dark">About Us</div>
        <Title>Our Mission</Title>
        <div className="about-mission-grid">
          <div className="simplePanel">
            <Title level={4}>VISIBILITY</Title>
            <Paragraph>
              A free service for athletes that makes the recruiting process more transparent, accessible,
              informative, and affordable.
            </Paragraph>
          </div>
          <div className="simplePanel">
            <Title level={4}>ACCURATE DATA</Title>
            <Paragraph>
              A valuable recruiting tool for college coaches to efficiently identify quality student
              athletes with less cost and more accuracy.
            </Paragraph>
          </div>
        </div>

        <Title level={3}>Our Story</Title>
        <Paragraph className="lead">
          Many services charge student athletes and their parents large fees for exposure to college
          programs, but these often do not deliver because the data can be unreliable. At Verified
          Athletics, we are changing that model by keeping athlete visibility free while building a
          trusted data platform used by college teams.
        </Paragraph>
        <Paragraph className="lead">
          This approach creates maximum exposure for athletes and gives coaches reliable recruiting
          intelligence so they can focus on finding the right fit for their class needs.
        </Paragraph>

        <Title level={3}>Meet the Team</Title>
        <div className="about-founders-grid">
          {FOUNDERS.map((founder) => (
            <article key={founder.name} className="about-founder-card">
              <img
                src={founder.image}
                alt={founder.name}
                className="about-founder-image"
              />
              <div className="about-founder-meta">
                <h4>{founder.name}</h4>
                <p className="about-founder-role">{founder.role}</p>
                <p>{founder.bio}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="about-team-grid">
          {TEAM.map((member) => (
            <article key={member.name} className="about-team-card">
              <img src={member.image} alt={member.name} className="about-team-image" />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </article>
          ))}
        </div>
      </div>

      <section className="about-contact-band">
        <div className="container about-contact-grid">
          <div>
            <h3>Contact us.</h3>
            <p>support@verifiedathletics.com</p>
          </div>
          <form className="about-contact-form">
            <div className="about-form-row">
              <input placeholder="First Name (required)" />
              <input placeholder="Last Name (required)" />
            </div>
            <input placeholder="Email (required)" />
            <input placeholder="Phone (required)" />
            <textarea placeholder="Message (required)" rows={5} />
            <select defaultValue="">
              <option value="" disabled>
                Tell Us Who You Are (required)
              </option>
              <option>College Coach</option>
              <option>High School Coach</option>
              <option>Athlete / Parent</option>
              <option>Other</option>
            </select>
            <button type="button" className="btn light">
              Send
            </button>
          </form>
        </div>
      </section>

      <section className="about-subscribe-band">
        <div className="container about-subscribe-inner">
          <h3>Subscribe</h3>
          <p>Sign up with your email address to receive news and updates.</p>
          <div className="about-subscribe-cta-row">
            <input placeholder="Email Address" />
            <button type="button" className="btn light">
              Sign Up
            </button>
          </div>
          <small>We respect your privacy.</small>
          <div className="about-jobs">
            <strong>Join the team</strong>{" "}
            <span>
              See available opportunities on our <Link href="/jobs">Jobs</Link> page.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
