export interface ProductReview {
  id: string;
  authorFirstName: string;
  authorLastName: string;
  title: string;
  content: string;
  creationDate: number;
  rating: number;
  showAuthorNameFlag: boolean;
  localeID: string;
}
