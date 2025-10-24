import { Metadata } from "next";

import DashboardWrapper from "./_components/dashboard-wrapper";

import {
  generatePageMetadata,
  pageMetadataConfigs,
} from "@/lib/utils/page-metadata";

export const metadata: Metadata = generatePageMetadata(
  pageMetadataConfigs.dashboard,
);

export default function page() {
  return <DashboardWrapper />;
}
