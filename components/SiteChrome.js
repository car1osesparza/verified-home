"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfigProvider, Modal, Select } from "antd";
import { SPORTS } from "../lib/site-data";
import { getSelectedSport } from "../lib/sport-preference";
import HashScroll from "./HashScroll";
import { MarketingFooter, MarketingTopNav } from "./MarketingChromeParts";
import { useSportSelection } from "./SportSelectionProvider";

function SiteChromeInner({ children }) {
  const router = useRouter();
  const { sport, hasSport, applySport } = useSportSelection();
  const [sportModalOpen, setSportModalOpen] = useState(false);
  const [modalSport, setModalSport] = useState();
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState();

  useEffect(() => {
    const stored = getSelectedSport(SPORTS);
    if (stored) {
      setModalSport(stored);
    }
  }, []);

  useEffect(() => {
    const onOpenSportModal = (event) => {
      const redirect = event.detail?.redirectUrl;
      setPendingRedirectUrl(typeof redirect === "string" && redirect.length > 0 ? redirect : undefined);
      setModalSport(getSelectedSport(SPORTS));
      setSportModalOpen(true);
    };

    window.addEventListener("va:open-sport-modal", onOpenSportModal);
    return () => window.removeEventListener("va:open-sport-modal", onOpenSportModal);
  }, []);

  const handleSportModalConfirm = () => {
    if (!modalSport) {
      return;
    }

    applySport(modalSport);
    setSportModalOpen(false);

    if (pendingRedirectUrl) {
      router.push(pendingRedirectUrl);
      setPendingRedirectUrl(undefined);
    }
  };

  const closeSportModal = () => {
    setSportModalOpen(false);
    setPendingRedirectUrl(undefined);
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
        <MarketingTopNav sport={sport} hasSport={hasSport} onSportChange={applySport} />
        <HashScroll />
        <main>{children}</main>

        <Modal
          title="Select your sport"
          open={sportModalOpen}
          closable
          mask={{ closable: true }}
          keyboard
          onCancel={closeSportModal}
          cancelButtonProps={{ style: { display: "none" } }}
          onOk={handleSportModalConfirm}
          okText="Continue"
          okButtonProps={{ disabled: !modalSport, className: modalSport ? "sport-selected-ant-btn" : undefined }}
        >
          <p className="sport-modal-copy">
            A sport selection is required before continuing to demo or pricing actions.
          </p>
          <Select
            allowClear
            value={modalSport}
            placeholder="Choose sport"
            className={modalSport ? "sport-select-highlight" : undefined}
            style={{ width: "100%" }}
            options={SPORTS.map((label) => ({ value: label, label }))}
            onChange={(value) => setModalSport(value)}
          />
        </Modal>
        <MarketingFooter />
      </div>
    </ConfigProvider>
  );
}

export default function SiteChrome({ children }) {
  return <SiteChromeInner>{children}</SiteChromeInner>;
}
