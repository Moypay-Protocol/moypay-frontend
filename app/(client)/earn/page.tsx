import { Metadata } from "next";

import EarnWrapper from "./_components/earn-wrapper";

import {
  generatePageMetadata,
  pageMetadataConfigs,
} from "@/lib/utils/page-metadata";

export const metadata: Metadata = generatePageMetadata(
  pageMetadataConfigs.earn,
);

export default function page() {
  return <EarnWrapper />;
}
