export enum ASSETS {
  SP_500_INDEX = "SP_500_INDEX",
  USSTHPI_PC1 = "USSTHPI_PC1",
  CASTHPI_PC1 = "CASTHPI_PC1",
  NYSTHPI_PC1 = "NYSTHPI_PC1",
  ATNHPIUS41884Q_PC1 = "ATNHPIUS41884Q_PC1",
  ATNHPIUS35614Q_PC1 = "ATNHPIUS35614Q_PC1",
  ATNHPIUS33124Q_PC1 = "ATNHPIUS33124Q_PC1",
  FLSTHPI_PC1 = "FLSTHPI_PC1",
}

export const ASSET_NAMES: Record<string, string> = {
  [ASSETS.USSTHPI_PC1]: "US Homes",
  [ASSETS.CASTHPI_PC1]: "California Homes",
  [ASSETS.NYSTHPI_PC1]: "New York State Homes",
  [ASSETS.ATNHPIUS41884Q_PC1]: "San Francisco Homes",
  [ASSETS.ATNHPIUS35614Q_PC1]: "New York City Homes",
  [ASSETS.ATNHPIUS33124Q_PC1]: "Miami Homes",
  [ASSETS.FLSTHPI_PC1]: "Florida Homes",
  [ASSETS.SP_500_INDEX]: "S&P 500",
};


export const ASSET_COLORS: Record<string, string> = {
  [ASSETS.USSTHPI_PC1]: "#FF6B6B", // Bright coral red
  [ASSETS.CASTHPI_PC1]: "#4ECDC4", // Bright turquoise
  [ASSETS.NYSTHPI_PC1]: "#FFE66D", // Bright yellow
  [ASSETS.ATNHPIUS41884Q_PC1]: "#FF8C42", // Bright orange
  [ASSETS.ATNHPIUS35614Q_PC1]: "#9B59B6", // Purple
  [ASSETS.ATNHPIUS33124Q_PC1]: "#96F550", // Lime green
  [ASSETS.FLSTHPI_PC1]: "#FF69B4", // Hot pink
  [ASSETS.SP_500_INDEX]: "#2ECC71", // Emerald green
};
