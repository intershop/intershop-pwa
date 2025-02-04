/**
 * Interface for Sparque Suggestions API response object
 */
export interface SparqueSuggestions {
  products?: SparqueProduct[];
  categories?: SparqueCategory[];
  brands?: SparqueBrand[];
  keywordSuggestions?: SparqueKeywordSuggestions[];
  contentSuggestions?: SparqueContentSuggestions[];
}

export interface SparqueProduct {
  sku: string;
  name: string;
  defaultBrandName?: string;
  defaultcategoryId: string;
  gtin?: string;
  shortDescription?: string;
  longDescription?: string;
  manufacturer?: string;
  type?: string;
  rank?: number;
  offers?: SparqueOffer[];
  productVariants?: string[];
  productMaster?: string;
  attributes?: SparqueAttribute[];
  images: SparqueImage[];
  attachments?: SparqueAttachment[];
  variantAttributes?: SparqueVariantAttribute[];
}

export interface SparqueCategory {
  categoryID: string;
  categoryName: string;
  categoryURL?: string;
  totalCount: number;
  position?: number;
  parentCategoryId: string;
  subCategories?: string[];
  attributes?: SparqueAttribute[];
}

export interface SparqueBrand {
  brandName: string;
  totalCount: number;
  imageUrl: string;
}

export interface SparqueKeywordSuggestions {
  keyword: string;
}

export interface SparqueContentSuggestions {
  newsType: string;
  paragraph: string;
  slug: string;
  summary: string;
  title: string;
  type: string;
  articleDate: Date;
}

interface SparqueOffer {
  priceExclVat: number;
  priceIncVat: number;
  vatAmount: number;
  vatPercentage: number;
  currency: string;
  type: string;
}

export interface SparqueAttribute {
  name: string;
  value: string;
}

export interface SparqueImage {
  id: string;
  extension?: string;
  url: string;
  isPrimaryImage?: boolean;
  attributes?: SparqueAttribute[];
}

interface SparqueAttachment {
  id: string;
  extension: string;
  relativeUrl: string;
  attributes: SparqueAttribute[];
}

interface SparqueVariantAttribute {
  id: string;
  value: string;
  name: string;
  sku: string;
}
