import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ImageRoutingBridgeService } from '../services/image-routing-bridge/image-routing-bridge.service';
import { getCopilotConfig } from '../store/copilot-config/copilot-config.selectors';

@Injectable({ providedIn: 'root' })
export class CopilotFacade {
  constructor(
    private store: Store,
    private imageRoutingBridgeService: ImageRoutingBridgeService
  ) {}

  copilotConfiguration$ = this.store.pipe(select(getCopilotConfig));

  enableImageRouting() {
    this.imageRoutingBridgeService.enable();
  }
}
