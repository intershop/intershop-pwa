export interface ErrorFeedback {
  causes?: ErrorCauseFeedback[];
  code: string;
  message: string;
}

export interface ErrorCauseFeedback {
  message: string;
  parameters?: {
    sku?: string;
  };
}
