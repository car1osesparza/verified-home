"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfigProvider, Modal, Select } from "antd";
import { SPORTS } from "../lib/site-data";
import { getSelectedSport, setSelectedSport } from "../lib/sport-preference";
import { MarketingFooter, MarketingTopNav } from "./MarketingChromeParts";

export default function SiteChrome({ children }) {
  const router = useRouter();
  const [sport, setSport] = useState();
  const [sportModalOpen, setSportModalOpen] = useState(false);
  const [modalSport, setModalSport] = useState();
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState();

  useEffect(() => {
    const stored = getSelectedSport(SPORTS);
    if (stored) {
      setSport(stored);
      setModalSport(stored);
    }
  }, []);

  useEffect(() => {
    const onSportUpdated = (event) => {
      const nextSport = event.detail?.sport;
      if (nextSport && SPORTS.includes(nextSport)) {
        setSport(nextSport);
        setModalSport(nextSport);
      }
    };

    window.addEventListener("va:selected-sport", onSportUpdated);
    return () => window.removeEventListener("va:selected-sport", onSportUpdated);
  }, []);

  useEffect(() => {
    const onDocumentClickCapture = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const forcedSportModalElement = target.closest("[data-open-sport-modal='true']");
      if (forcedSportModalElement) {
        event.preventDefault();
        event.stopPropagation();
        const explicitRedirect = forcedSportModalElement.getAttribute("data-redirect-url");
        const hrefRedirect = forcedSportModalElement.getAttribute("href");
        setPendingRedirectUrl(explicitRedirect || hrefRedirect || "");
        setModalSport(getSelectedSport(SPORTS));
        setSportModalOpen(true);
        return;
      }

      const gatedElement = target.closest("[data-requires-sport='true']");
      if (!gatedElement) {
        return;
      }

      const selectedSport = getSelectedSport(SPORTS);
      if (selectedSport) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const explicitRedirect = gatedElement.getAttribute("data-redirect-url");
      const hrefRedirect = gatedElement.getAttribute("href");
      setPendingRedirectUrl(explicitRedirect || hrefRedirect || "");
      setModalSport(undefined);
      setSportModalOpen(true);
    };

    document.addEventListener("click", onDocumentClickCapture, true);
    return () => document.removeEventListener("click", onDocumentClickCapture, true);
  }, []);

  useEffect(() => {
    const onOpenSportModal = () => {
      setPendingRedirectUrl(undefined);
      setModalSport(getSelectedSport(SPORTS));
      setSportModalOpen(true);
    };

    window.addEventListener("va:open-sport-modal", onOpenSportModal);
    return () => window.removeEventListener("va:open-sport-modal", onOpenSportModal);
  }, []);

  const handleSportChange = (value) => {
    setSport(value);
    setModalSport(value);
    setSelectedSport(value);
  };

  const handleSportModalConfirm = () => {
    if (!modalSport) {
      return;
    }

    setSelectedSport(modalSport);
    setSport(modalSport);
    setSportModalOpen(false);

    if (pendingRedirectUrl) {
      router.push(pendingRedirectUrl);
      setPendingRedirectUrl(undefined);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ca252b",
          colorTextBase: "#0d1b2a",
          colorBgBase: "#f6f8fb",
          borderRadius: 10,
          fontFamily:
            "Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        },
      }}
    >
      <div style={{ minHeight: "100vh" }}>
        <MarketingTopNav sport={sport} hasSport={Boolean(sport)} onSportChange={handleSportChange} />
        <main>{children}</main>

        <Modal
          title="Select your sport"
          open={sportModalOpen}
          closable={false}
          maskClosable={false}
          keyboard={false}
          cancelButtonProps={{ style: { display: "none" } }}
          onCancel={() => {}}
          onOk={handleSportModalConfirm}
          okText="Continue"
          okButtonProps={{ disabled: !modalSport, className: modalSport ? "sport-selected-ant-btn" : undefined }}
        >
          <p className="sport-modal-copy">
            A sport selection is required before continuing to demo or pricing actions.
          </p>
          <Select
            value={modalSport}
            placeholder="My sport"
            className={modalSport ? "sport-select-highlight" : undefined}
            style={{ width: "100%" }}
            options={SPORTS.map((label) => ({ value: label, label }))}
            onChange={setModalSport}
          />
        </Modal>
        <MarketingFooter />
      </div>
    </ConfigProvider>
  );
}
