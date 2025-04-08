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
  [ASSETS.USSTHPI_PC1]: "#8E44AD",  // Purple (Slightly deeper, less saturated purple)
  [ASSETS.CASTHPI_PC1]: "#E74C3C",  // Red (Clear, strong red)
  [ASSETS.NYSTHPI_PC1]: "#F39C12",  // Orange/Gold (Replacing mustard with a clearer orange-gold)
  [ASSETS.ATNHPIUS41884Q_PC1]: "#F67280",  // Coral/Pink (Replacing bright orange with a warm coral)
  [ASSETS.ATNHPIUS35614Q_PC1]: "#3498DB",  // Blue (Replacing teal with a standard blue for better separation)
  [ASSETS.ATNHPIUS33124Q_PC1]: "#2ECC71",  // Green (Clear, medium green)
  [ASSETS.FLSTHPI_PC1]: "#E84393",  // Pink/Magenta (Replacing hot pink with a strong magenta)
  [ASSETS.SP_500_INDEX]: "#1ABC9C"   // Teal/Aqua (Replacing the second green with a distinct teal)
};

export const ASSET_TOOLTIP_TEXTS: Record<string, string> = {
  [ASSETS.USSTHPI_PC1]: "US Federal Housing Financy Agency House Price Index",
  [ASSETS.CASTHPI_PC1]: "CA Federal Housing Financy Agency House Price Index",
  [ASSETS.NYSTHPI_PC1]: "NY State Federal Housing Financy Agency House Price Index",
  [ASSETS.ATNHPIUS41884Q_PC1]: "SF Federal Housing Financy Agency House Price Index",
  [ASSETS.ATNHPIUS35614Q_PC1]: "NYC Federal Housing Financy Agency House Price Index",
  [ASSETS.ATNHPIUS33124Q_PC1]: "Miami Federal Housing Financy Agency House Price Index",
  [ASSETS.FLSTHPI_PC1]: "FL Federal Housing Financy Agency House Price Index",
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
