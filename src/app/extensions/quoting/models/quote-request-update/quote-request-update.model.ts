export type QuoteRequestUpdate =
  | {
      type: 'change-item';
      itemId: string;
      quantity: number;
    }
  | {
      type: 'meta-data';
      displayName: string;
      description: string;
    }
  | {
      type: 'remove-item';
      itemId: string;
    };
