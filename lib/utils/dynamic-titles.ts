import { siteConfig } from "@/config/site";

interface DynamicTitleConfig {
  basePage: string;
  entity?: string;
  action?: string;
  status?: string;
}

export function generateDynamicTitle(config: DynamicTitleConfig): string {
  const parts: string[] = [];

  if (config.action) {
    parts.push(config.action);
  }

  if (config.entity) {
    parts.push(config.entity);
  }

  parts.push(config.basePage);

  if (config.status) {
    parts.push(`(${config.status})`);
  }

  const title = parts.join(" - ");

  return `${title} | ${siteConfig.name}`;
}

export const titleGenerators = {
  organization: (name?: string, action?: string) =>
    generateDynamicTitle({
      basePage: "Organization",
      entity: name || "Management",
      action: action,
    }),

  employee: (name?: string, action?: string) =>
    generateDynamicTitle({
      basePage: "Employee",
      entity: name || "Management",
      action: action,
    }),

  earnings: (period?: string, status?: string) =>
    generateDynamicTitle({
      basePage: "Earnings",
      entity: period,
      status: status,
    }),

  dashboard: (section?: string) =>
    generateDynamicTitle({
      basePage: "Dashboard",
      entity: section,
    }),

  settings: (section?: string) =>
    generateDynamicTitle({
      basePage: "Settings",
      entity: section,
    }),

  error: (code?: string) =>
    generateDynamicTitle({
      basePage: "Error",
      entity: code ? `${code}` : "Unknown",
    }),
};

export const pageFormats = {
  detail: (type: string, name: string) => `${type}: ${name}`,
  list: (type: string, count?: number) => (count ? `${type} (${count})` : type),
  action: (action: string, target: string) => `${action} ${target}`,
  status: (item: string, status: string) => `${item} - ${status}`,
};
