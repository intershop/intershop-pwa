export interface ProductReview {
  id: string;
  authorFirstName: string;
  authorLastName: string;
  title: string;
  content: string;
  rating: number;
  creationDate?: number;
  showAuthorNameFlag?: boolean;
  localeID?: string;
  own?: boolean;
  status?: 'NEW' | 'REJECTED';
}

export type ProductReviewCreationType = Pick<ProductReview, 'title' | 'content' | 'rating' | 'showAuthorNameFlag'>;
