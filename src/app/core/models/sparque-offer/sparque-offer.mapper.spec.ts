import { TestBed } from '@angular/core/testing';

import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';

import { SparqueOfferMapper } from './sparque-offer.mapper';

const priceMin = {
  type: 'PriceItem',
  gross: 100,
  net: 80,
  currency: 'USD',
};

const priceMax = {
  type: 'PriceItem',
  gross: 120,
  net: 90,
  currency: 'USD',
};

const sumPrice = {
  type: 'PriceItem',
  gross: priceMin.gross + priceMax.gross,
  net: priceMax.net + priceMin.net,
  currency: priceMin.currency,
};

const productPriceDetails = [
  {
    sku: 'SKU1',
    prices: {
      salePrice: priceMin,
      listPrice: priceMin,
      scaledPrices: [],
      minSalePrice: priceMin,
      minListPrice: priceMin,
      maxSalePrice: priceMin,
      maxListPrice: priceMin,
      summedUpSalePrice: priceMin,
      summedUpListPrice: priceMin,
    },
  },
  {
    sku: 'SKU2',
    prices: {
      salePrice: priceMin,
      listPrice: priceMin,
      scaledPrices: [],
      minSalePrice: priceMin,
      minListPrice: priceMin,
      maxSalePrice: priceMax,
      maxListPrice: priceMax,
      summedUpSalePrice: sumPrice,
      summedUpListPrice: sumPrice,
    },
  },
] as ProductPriceDetails[];

const sparqueProductSingleOffer = {
  name: 'Product 1',
  shortDescription: 'Short description',
  longDescription: 'Long description',
  manufacturer: 'Manufacturer',
  sku: 'SKU1',
  defaultcategoryId: 'cat1',
  offers: [
    {
      priceIncVat: priceMin.gross,
      priceExclVat: priceMin.net,
      currency: priceMin.currency,
    },
  ],
} as SparqueProduct;

const sparqueProductRangedOffer = {
  name: 'Product 2',
  shortDescription: 'Short description',
  longDescription: 'Long description',
  manufacturer: 'Manufacturer',
  sku: 'SKU2',
  defaultcategoryId: 'cat2',
  offers: [
    {
      priceIncVat: priceMin.gross,
      priceExclVat: priceMin.net,
      currency: priceMin.currency,
    },
    {
      priceIncVat: priceMax.gross,
      priceExclVat: priceMax.net,
      currency: priceMax.currency,
    },
  ],
} as SparqueProduct;

describe('Sparque Offer Mapper', () => {
  let sparqueOfferMapper: SparqueOfferMapper;

  beforeEach(() => {
    sparqueOfferMapper = TestBed.inject(SparqueOfferMapper);
  });

  describe('mapOffers', () => {
    it('should map single offer response correctly', () => {
      const result = sparqueOfferMapper.mapOffers([sparqueProductSingleOffer]);
      expect(result).toHaveLength(1);
      expect(result[0].sku).toEqual(sparqueProductSingleOffer.sku);
      expect(result[0]).toEqual(productPriceDetails[0]);
    });
    it('should map range offer response correctly', () => {
      const result = sparqueOfferMapper.mapOffers([sparqueProductRangedOffer]);
      expect(result).toHaveLength(1);
      expect(result[0].sku).toEqual(sparqueProductRangedOffer.sku);
      expect(result[0]).toEqual(productPriceDetails[1]);
    });

    it('should map array of products response correctly', () => {
      const result = sparqueOfferMapper.mapOffers([sparqueProductSingleOffer, sparqueProductRangedOffer]);
      expect(result).toHaveLength(2);
      expect(result[0].sku).toEqual(sparqueProductSingleOffer.sku);
      expect(result[0]).toEqual(productPriceDetails[0]);
      expect(result[1].sku).toEqual(sparqueProductRangedOffer.sku);
      expect(result[1]).toEqual(productPriceDetails[1]);
    });

    it('should return only product price details for product with offer', () => {
      const result = sparqueOfferMapper.mapOffers([
        { ...sparqueProductSingleOffer, offers: [] },
        sparqueProductRangedOffer,
      ]);
      expect(result).toHaveLength(1);
      expect(result[0].sku).toEqual(sparqueProductRangedOffer.sku);
      expect(result[0]).toEqual(productPriceDetails[1]);
    });

    it('should return empty array if offers are empty', () => {
      const result = sparqueOfferMapper.mapOffers([{ ...sparqueProductSingleOffer, offers: [] }]);
      expect(result).toBeEmpty();
    });
  });
});
