import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { whenTruthy } from 'ish-core/utils/operators';

import { CopilotEmbeddedConfig } from '../models/copilot-embedded-config/copilot-embedded-config.model';
import { getCopilotEmbeddedConfig } from '../store/copilot-embedded-config/copilot-embedded-config.selectors';

@Injectable({ providedIn: 'root' })
export class CopilotEmbeddedFacade {
  constructor(private store: Store) {}

  /**
   * The Copilot Embedded configuration (server state, environment variable or `environment.ts`).
   * Emits once the lazily loaded store slice holds the configuration.
   */
  configuration$: Observable<CopilotEmbeddedConfig> = this.store.pipe(select(getCopilotEmbeddedConfig), whenTruthy());
}
