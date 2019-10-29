export interface BasketInfo {
  causes?: {
    code: string;
    message?: string;
  }[];
  code: string;
  message: string;
}
