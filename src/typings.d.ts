declare module 'express-robots-txt';

declare module '@mixmark-io/domino' {
  export function createDocument(html?: string, force?: boolean): Document;
}

declare const PRODUCTION_MODE: boolean;

declare const SERVICE_WORKER: boolean;

declare const NGRX_RUNTIME_CHECKS: boolean;

declare const PWA_VERSION: string;

declare const THEME: string;

declare const SSR: boolean;
