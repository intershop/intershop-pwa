import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';
import { getCopilotConfig } from '../store/copilot-config/copilot-config.selectors';

@Injectable({ providedIn: 'root' })
export class CopilotFacade {
  private moduleLoader = inject(ModuleLoaderService);

  constructor(private store: Store) {}

  copilotConfiguration$ = this.moduleLoader.whenLoaded('copilot', () => this.store.pipe(select(getCopilotConfig)));
}
