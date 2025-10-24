import { Metadata } from "next";

import Home from "./_components/home";

import {
  generatePageMetadata,
  pageMetadataConfigs,
} from "@/lib/utils/page-metadata";

export const metadata: Metadata = generatePageMetadata(
  pageMetadataConfigs.home,
);

export default function page() {
  return <Home />;
}
