export interface SparqueOffer {
  priceExclVat: number;
  priceIncVat: number;
  vatAmount?: number;
  vatPercentage?: number;
  currency: string;
  type?: string;
}
