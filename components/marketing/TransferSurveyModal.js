"use client";

import { useState } from "react";
import { Modal } from "antd";
import { SPORTS } from "../../lib/site-data";

const SURVEY_EMAIL = "nate@verifiedathletics.com";

export default function TransferSurveyModal({ open, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const sport = String(data.get("sport") || "").trim();
    const school = String(data.get("school") || "").trim();
    const message = String(data.get("message") || "").trim();

    const body = [
      "Transfer Survey Request",
      "",
      `First Name: ${firstName}`,
      `Last Name: ${lastName}`,
      `Email: ${email}`,
      `Sport: ${sport}`,
      `School: ${school}`,
      "",
      "Message:",
      message || "(none)",
    ].join("\n");

    const mailto = `mailto:${SURVEY_EMAIL}?subject=${encodeURIComponent("Transfer Survey Request")}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
    form.reset();
  }

  return (
    <Modal
      title="Request Transfer Survey"
      open={open}
      onCancel={handleClose}
      footer={null}
      className="transfer-survey-modal"
      destroyOnHidden
      centered
    >
      {submitted ? (
        <p className="transfer-survey-success">
          Your email app should open with the survey details addressed to {SURVEY_EMAIL}. Send the
          message to complete your request. If nothing opens, email {SURVEY_EMAIL} directly.
        </p>
      ) : (
        <form className="transfer-survey-form" onSubmit={handleSubmit} noValidate>
          <div className="transfer-survey-row">
            <label>
              First Name
              <input type="text" name="firstName" required autoComplete="given-name" />
            </label>
            <label>
              Last Name
              <input type="text" name="lastName" required autoComplete="family-name" />
            </label>
          </div>
          <label>
            Email
            <input type="email" name="email" required autoComplete="email" />
          </label>
          <label>
            Sport
            <select name="sport" required defaultValue="">
              <option value="" disabled>
                Select sport
              </option>
              {SPORTS.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </label>
          <label>
            School
            <input type="text" name="school" required autoComplete="organization" />
          </label>
          <label>
            Message
            <textarea name="message" rows={4} />
          </label>
          <button type="submit" className="btn red">
            Submit request
          </button>
        </form>
      )}
    </Modal>
  );
}
