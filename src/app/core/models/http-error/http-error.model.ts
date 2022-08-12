interface ErrorCause {
  message: string;
  parameters?: {
    [id: string]: string;
  };
}

export interface ErrorFeedback {
  causes?: ErrorCause[];
  code: string;
  message: string;
}

export interface HttpError {
  /** name for distinguishing with other errors */
  name: 'HttpErrorResponse';

  /** unique reference for identifying the problem - in our case the error translation key */
  code?: string;

  /** HTTP status code */
  status?: number;

  /** human readable (and localized) error message */
  message?: string;

  /* if the response contains a data section with errors and causes, e.g. in the basket and order REST response */
  errors?: ErrorFeedback[];
}
