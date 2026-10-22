import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CopilotEmbeddedConfig } from '../models/copilot-embedded-config/copilot-embedded-config.model';
import { getCopilotEmbeddedConfig } from '../store/copilot-embedded-config/copilot-embedded-config.selectors';

@Injectable({ providedIn: 'root' })
export class CopilotEmbeddedFacade {
  constructor(private store: Store) {}

  configuration$: Observable<CopilotEmbeddedConfig> = this.store.pipe(select(getCopilotEmbeddedConfig));
}
