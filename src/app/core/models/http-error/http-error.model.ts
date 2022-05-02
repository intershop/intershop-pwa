interface ErrorCauseFeedback {
  message: string;
  parameters?: {
    [id: string]: string;
  };
}

export interface ErrorFeedback {
  causes?: ErrorCauseFeedback[];
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

  causes?: ErrorFeedback[];
}
