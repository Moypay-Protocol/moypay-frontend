import { Metadata } from "next";

import { siteConfig } from "@/config/site";

interface PageMetadataConfig {
  title?: string;
  description?: string;
  keywords?: readonly string[] | string[];
  openGraph?: {
    title?: string;
    description?: string;
    images?: string[];
  };
  twitter?: {
    title?: string;
    description?: string;
  };
}

export function generatePageMetadata(config: PageMetadataConfig): Metadata {
  const title = config.title
    ? `${config.title} | ${siteConfig.name}`
    : siteConfig.name;

  const description = config.description || siteConfig.description;

  return {
    title,
    description,
    keywords: config.keywords
      ? [...config.keywords, siteConfig.name]
      : undefined,
    openGraph: {
      title: config.openGraph?.title || title,
      description: config.openGraph?.description || description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: config.openGraph?.images || [
        {
          url: `${siteConfig.url}/og-image.png`,
          width: 1200,
          height: 631,
          alt: siteConfig.name,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.twitter?.title || title,
      description: config.twitter?.description || description,
      images: config.openGraph?.images
        ? [...config.openGraph.images]
        : [`${siteConfig.url}/og-image.png`],
      creator: "@moypay",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

function createPageMetadataConfig(
  config: PageMetadataConfig,
): PageMetadataConfig {
  return config;
}

export const pageMetadataConfigs = {
  home: createPageMetadataConfig({
    title: "Home",
    description:
      "From salary to automated yield in seconds — decentralized, permissionless, and unstoppable with MoyPay.",
    keywords: [
      "passive income",
      "defi",
      "salary streaming",
      "automated yield",
      "decentralized payroll",
    ],
  }),
  dashboard: createPageMetadataConfig({
    title: "Dashboard",
    description:
      "Manage your organizations, employees, and payroll systems with MoyPay's decentralized platform.",
    keywords: [
      "dashboard",
      "payroll management",
      "organizations",
      "employee management",
      "defi payroll",
    ],
  }),
  earn: createPageMetadataConfig({
    title: "Earn",
    description:
      "Discover automated yield strategies and earning opportunities with MoyPay's DeFi integration.",
    keywords: [
      "automated earnings",
      "yield farming",
      "defi",
      "passive income",
      "crypto yield",
    ],
  }),
  organizations: createPageMetadataConfig({
    title: "Organization",
    description:
      "Create and manage organizations, handle employee payroll, and track salary streams.",
    keywords: [
      "organization management",
      "payroll",
      "employees",
      "salary streams",
      "business management",
    ],
  }),
  organizationDetail: createPageMetadataConfig({
    title: "Organization",
    description:
      "Manage organization employees, payroll settings, and salary streaming configuration.",
    keywords: [
      "organization dashboard",
      "employee management",
      "payroll settings",
      "salary streams",
    ],
  }),
  employeeEarnings: createPageMetadataConfig({
    title: "My Earnings",
    description:
      "View your salary streams, earnings history, and automated yield from joined organizations.",
    keywords: [
      "employee earnings",
      "salary streams",
      "automated yield",
      "earnings history",
      "payroll",
    ],
  }),
};
