/* SystemJS module definition */
declare var module: NodeModule;

declare module '@angular/common/locales/global/de';

declare module '@angular/common/locales/global/fr';

interface NodeModule {
  id: string;
}

declare var PRODUCTION_MODE: boolean;

declare var SERVICE_WORKER: boolean;

declare var NGRX_RUNTIME_CHECKS: boolean;

declare var PWA_VERSION: string;
