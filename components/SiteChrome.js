"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfigProvider, Modal, Select } from "antd";
import { SPORTS } from "../lib/site-data";
import { handleSportDropdownChange } from "../lib/sport-dropdown";
import { openCalendlyForSport } from "../lib/sport-calendly";
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

    const sportToBook = modalSport;
    applySport(sportToBook);
    setSportModalOpen(false);

    if (pendingRedirectUrl) {
      router.push(pendingRedirectUrl);
      setPendingRedirectUrl(undefined);
      return;
    }

    openCalendlyForSport(sportToBook);
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
      <div className="site-shell">
        <MarketingTopNav
          sport={sport}
          hasSport={hasSport}
          onSportChange={handleSportDropdownChange}
        />
        <HashScroll />
        <main>{children}</main>

        <Modal
          title="Select your sport"
          open={sportModalOpen}
          closable
          mask={{ closable: true }}
          keyboard
          onCancel={closeSportModal}
          footer={
            <div className="sport-modal-footer">
              <button
                type="button"
                className={`btn red sport-modal-demo-btn${modalSport ? " sport-selected" : ""}`}
                disabled={!modalSport}
                onClick={handleSportModalConfirm}
              >
                Book a Demo
              </button>
            </div>
          }
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
