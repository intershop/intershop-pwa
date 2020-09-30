export type QuoteRequestUpdate =
  | {
      type: 'meta-data';
      displayName: string;
      description: string;
    }
  | {
      type: 'remove-item';
      itemId: string;
    }
  | {
      type: 'change-item';
      itemId: string;
      quantity: number;
    };
