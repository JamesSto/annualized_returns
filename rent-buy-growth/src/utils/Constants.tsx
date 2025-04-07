export enum ASSETS {
  SP_500_INDEX = "SP_500_INDEX",
  USSTHPI_PC1 = "USSTHPI_PC1",
  CASTHPI_PC1 = "CASTHPI_PC1",
  NYSTHPI_PC1 = "NYSTHPI_PC1",
  FLSTHPI_PC1 = "FLSTHPI_PC1",
  ATNHPIUS41884Q_PC1 = "ATNHPIUS41884Q_PC1",
  ATNHPIUS35614Q_PC1 = "ATNHPIUS35614Q_PC1",
  ATNHPIUS33124Q_PC1 = "ATNHPIUS33124Q_PC1",
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

export const ASSET_TOOLTIP_TEXTS: Record<string, string> = {
  [ASSETS.USSTHPI_PC1]: "US House Price Index",
  [ASSETS.CASTHPI_PC1]: "CA House Price Index",
  [ASSETS.NYSTHPI_PC1]: "NY State House Price Index",
  [ASSETS.ATNHPIUS41884Q_PC1]: "Miami House Price Index",
  [ASSETS.ATNHPIUS35614Q_PC1]: "SF House Price Index",
  [ASSETS.ATNHPIUS33124Q_PC1]: "NYC House Price Index",
  [ASSETS.FLSTHPI_PC1]: "FL State House Price Index",
  [ASSETS.SP_500_INDEX]: "S&P 500 Growth, Dividends Reinvested",
};


export const ASSET_LINKS: Record<string, string> = {
  [ASSETS.USSTHPI_PC1]: "https://fred.stlouisfed.org/graph/?g=1FEU3",
  [ASSETS.CASTHPI_PC1]: "https://fred.stlouisfed.org/graph/?g=1FEU3",
  [ASSETS.NYSTHPI_PC1]: "Index https://fred.stlouisfed.org/graph/?g=1FEU3",
  [ASSETS.ATNHPIUS41884Q_PC1]: "https://fred.stlouisfed.org/graph/?g=1FEU3",
  [ASSETS.ATNHPIUS35614Q_PC1]: "https://fred.stlouisfed.org/graph/?g=1FEU3",
  [ASSETS.ATNHPIUS33124Q_PC1]: "https://fred.stlouisfed.org/graph/?g=1FEU3",
  [ASSETS.FLSTHPI_PC1]: "https://fred.stlouisfed.org/graph/?g=1FEU3",
  [ASSETS.SP_500_INDEX]: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html",
};
