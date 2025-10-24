export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "MoyPay",
  description:
    "MoyPay is payroll management app that helps you manage your employees payroll, taxes, and benefits with ease.",
  url:
    typeof window !== "undefined" && window.location.hostname !== "localhost"
      ? "https://app.moypay.xyz"
      : "http://localhost:3000",
  links: {
    github: "https://github.com/MoyPay",
  },
  navItems: [
    {
      label: "Home",
      href: "/home",
    },
    {
      label: "Earn",
      href: "/earn",
    },
    {
      label: "Faucet",
      href: "/faucet",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
  ],
};
