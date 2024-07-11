export type Analytics = {
  studio: StudioAnalytics;
  audiences: AudienceAnalytics;
};

export type StudioAnalytics = {
  tokensCreated: number;
  tokensListed: number;
  tokensSold: number;
  tokensAirdropped: number;
  collectionsCreated: number;
  totalMintTime: number;
};

export type AudienceAnalytics = {
  tradingVolume: {
    pastYear: number[]; //Last 24 to 12 months
    currentYear: number[]; //Last 12 months
  };
  itemsCount: number;
  holdersCount: number;
  avgPurchasePrice: number;
  mintFloorDiff: number;
  topHolders: string[];
  mostLoyalHolder: string[];
  collectionCrossover: string[];
  currentFloorPrice: {
    pastYear: number[]; //Last 24 to 12 months
    currentYear: number[]; //Last 12 months
  };
  avgHoldingDuration: number;
  totalTrades: number;
  churnedWallets: string[];
  newHolders: string[];
  lowestPurchasePrice: {
    pastYear: number[]; //Last 24 to 12 months
    currentYear: number[]; //Last 12 months
  };
  highestPurchasePrice: {
    pastYear: number[]; //Last 24 to 12 months
    currentYear: number[]; //Last 12 months
  };
};
