import { contractAddresses } from "@/lib/constants";

export type EarnData = {
  id: string;
  name: string;
  description: string;
  address: string;
  apy: number;
  tvl: number;
  iconUrl: string;
  assetUrl: string;
};

export const earnData: EarnData[] = [
  {
    id: "1",
    name: "Morpho",
    description: "Earn yield by depositing into the Morpho.",
    address: contractAddresses.mockVaultMorpho,
    apy: 4.5,
    tvl: 1000000,
    iconUrl: "/images/protocols/morpho.png",
    assetUrl: "/usdc.png",
  },
  {
    id: "2",
    name: "Compound",
    description: "Participate in the Compound protocol to earn interest.",
    address: contractAddresses.mockVaultCompound,
    apy: 3.75,
    tvl: 2000000,
    iconUrl: "/images/protocols/compound.png",
    assetUrl: "/usdc.png",
  },
  {
    id: "3",
    name: "Centuari",
    description: "Earn yield through the Centuari.",
    address: contractAddresses.mockVaultCentuari,
    apy: 4.0,
    tvl: 1500000,
    iconUrl: "/images/protocols/centuari.png",
    assetUrl: "/usdc.png",
  },
  {
    id: "4",
    name: "Tumbuh",
    description: "Grow your assets with the Tumbuh.",
    address: contractAddresses.mockVaultTumbuh,
    apy: 3.5,
    tvl: 1200000,
    iconUrl: "/images/protocols/tumbuh.png",
    assetUrl: "/usdc.png",
  },
  {
    id: "5",
    name: "Caer",
    description: "Secure your assets with the Caer.",
    address: contractAddresses.mockVaultCaer,
    apy: 4.25,
    tvl: 900000,
    iconUrl: "/images/protocols/caer.png",
    assetUrl: "/usdc.png",
  },
  {
    id: "6",
    name: "Aave",
    description: "Earn interest by depositing into the Aave.",
    address: contractAddresses.mockVaultAave,
    apy: 4.75,
    tvl: 2500000,
    iconUrl: "/images/protocols/aave.png",
    assetUrl: "/usdc.png",
  },
];
