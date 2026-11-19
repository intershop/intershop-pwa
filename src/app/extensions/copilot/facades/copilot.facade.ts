import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCopilotConfig } from '../store/copilot-config';

@Injectable({ providedIn: 'root' })
export class CopilotFacade {
  constructor(private store: Store) {}

  copilotConfiguration$ = this.store.pipe(select(getCopilotConfig));
}
