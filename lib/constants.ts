export const contractAddresses = {
  factory: "0x862E06f0211a99f3d80cF69c750b58388D240604" as HexAddress,
  earnStandard: "0x71Bb8BB1740F9D8f146b1E87ad1829B396C103e5" as HexAddress,
  mockUSDC: "0x6bDce7334b08614b9C5995253c70452a4838A653" as HexAddress,
  organization: "0xAf4F17179c94d9EADe48FBE1aE92e10b44777344" as HexAddress,
  mockVaultMorpho: "0x70aBee7152467614C78D28297266153D7d892E10" as HexAddress,
  mockVaultCompound: "0xcE2A83141adDF1bCc0b865FB09B04335E1292564" as HexAddress,
  mockVaultCentuari: "0xa7ce17560bb97e43dF283078728805f45E6D7635" as HexAddress,
  mockVaultTumbuh: "0x0be97492F5bf2a06240200d1703a204c20110c93" as HexAddress,
  mockVaultCaer: "0x0543176dC12E9c0B9Cf415d29ad0fb05023119CD" as HexAddress,
  mockVaultAave: "0x8081F559B85609CAccd6ECf91bE96217faDb83F0" as HexAddress,
} as const;

export const PERIOD_TIMES = {
  DAILY: 86400,
  WEEKLY: 604800,
  MONTHLY: 2592000,
  YEARLY: 31536000,
} as const;

export const PERIOD_LABELS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export const urlSubgraph = "https://indexer.moypay.xyz";
