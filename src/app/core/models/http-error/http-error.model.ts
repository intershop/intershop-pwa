export interface HttpHeader {
  [key: string]: string;
}

export interface HttpError extends Error {
  message: string;
  error: string;
  status: number;
  statusText: string;
  headers: HttpHeader;
}
