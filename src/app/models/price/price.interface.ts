export interface PriceData {
  type: string;
  value: number;
  currencyMnemonic: string;
  // TODO: check the relevance
  range?;
  priceRange?;
  scaledPrices?;
}
