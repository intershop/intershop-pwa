export interface HttpHeader {
  [key: string]: string;
}

export interface HttpError extends Error {
  message: string;
  error: string;
  errorCode: string;
  status: number;
  statusText: string;
  headers: HttpHeader;
}
