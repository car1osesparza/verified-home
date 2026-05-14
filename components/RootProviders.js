"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import SiteChrome from "./SiteChrome";
import { SportSelectionProvider } from "./SportSelectionProvider";

/** Client-only shell: Ant Design SSR registry + global sport context + chrome. */
export default function RootProviders({ children }) {
  return (
    <AntdRegistry hashPriority="high">
      <SportSelectionProvider>
        <SiteChrome>{children}</SiteChrome>
      </SportSelectionProvider>
    </AntdRegistry>
  );
}
