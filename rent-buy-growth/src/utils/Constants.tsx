export enum ASSETS {
  USSTHPI_PC1 = "USSTHPI_PC1",
  CASTHPI_PC1 = "CASTHPI_PC1",
  NYSTHPI_PC1 = "NYSTHPI_PC1",
  ATNHPIUS41884Q_PC1 = "ATNHPIUS41884Q_PC1",
  ATNHPIUS35614Q_PC1 = "ATNHPIUS35614Q_PC1",
  ATNHPIUS33124Q_PC1 = "ATNHPIUS33124Q_PC1",
  FLSTHPI_PC1 = "FLSTHPI_PC1",
  SP_500_INDEX = "SP_500_INDEX",
}

export const ASSET_NAMES: Record<string, string> = {
  USSTHPI_PC1: "US Homes",
  CASTHPI_PC1: "California Homes",
  NYSTHPI_PC1: "NY State Homes",
  ATNHPIUS41884Q_PC1: "SF Homes",
  ATNHPIUS35614Q_PC1: "NYC Homes",
  ATNHPIUS33124Q_PC1: "Miami Homes",
  FLSTHPI_PC1: "FL Homes",
  SP_500_INDEX: "S&P 500",
};


export const ASSET_COLORS: Record<string, string> = {
  USSTHPI_PC1: "#FF6B6B", // Bright coral red
  CASTHPI_PC1: "#4ECDC4", // Bright turquoise
  NYSTHPI_PC1: "#FFE66D", // Bright yellow
  ATNHPIUS41884Q_PC1: "#FF8C42", // Bright orange
  ATNHPIUS35614Q_PC1: "#9B59B6", // Purple
  ATNHPIUS33124Q_PC1: "#96F550", // Lime green
  FLSTHPI_PC1: "#FF69B4", // Hot pink
  SP_500_INDEX: "#2ECC71", // Emerald green
};
