export function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) =>
      Array.isArray(value) ? value.length > 0 : !!value,
    ),
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_APP_URL as string;

  return Response.json({
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },
    miniapp: {
      version: "1",
      name: "MoyPay",
      homeUrl: `${URL}`,
      iconUrl: `${URL}/logo-white.png`,
      splashImageUrl: `${URL}/splash-moypay.png`,
      splashBackgroundColor: "#0D0D0D",
      webhookUrl: `${URL}/api/webhook`,
      subtitle: "Payroll to DeFi in seconds",
      description:
        "MoyPay automates your payroll into on-chain yield — decentralized, transparent, and unstoppable. From salary to passive income in seconds.",
      screenshotUrls: [
        `${URL}/preview-1.png`,
        `${URL}/preview-2.png`,
        `${URL}/preview-3.png`,
      ],
      primaryCategory: "finance",
      tags: ["payroll", "defi", "yield", "base-network", "onchain-salary"],
      heroImageUrl: `${URL}/hero-moypay.png`,
      tagline: "Earn while you work",
      ogTitle: "Automated Payroll Yield",
      ogDescription:
        "Turn your salary into yield automatically. MoyPay brings decentralized payroll to life — all on Base Network.",
      ogImageUrl: `${URL}/og-moypay.png`,
      noindex: false,
    },
    baseBuilder: {
      allowedAddresses: ["0xB4F73ec35399faD2e123c70d9a4440684FBC3C62"],
    },
  });
}
