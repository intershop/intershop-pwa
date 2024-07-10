import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { getCurrentCurrency, getCurrentLocale, getRestEndpoint } from 'ish-core/store/core/configuration';
import { CustomerState, getCustomerState } from 'ish-core/store/customer/customer-store';

import { getCopilotToolCall } from '../store/copilot-store';
import { setActiveTool } from '../store/copilot.actions';

@Injectable({ providedIn: 'root' })
export class CopilotFacade {
  constructor(private store: Store) {}

  copilotToolCall$ = this.store.pipe(select(getCopilotToolCall));

  setCopilotToolCall(tool: string) {
    this.store.dispatch(setActiveTool({ tool }));
  }

  async getCurrentLocale(): Promise<string> {
    return await firstValueFrom(this.store.pipe(select(getCurrentLocale)));
  }

  async getCurrentCurrency(): Promise<string> {
    return await firstValueFrom(this.store.pipe(select(getCurrentCurrency)));
  }

  async getRestEndpoint(): Promise<string> {
    return await firstValueFrom(this.store.pipe(select(getRestEndpoint)));
  }

  async getCustomerState(): Promise<CustomerState> {
    return await firstValueFrom(this.store.pipe(select(getCustomerState)));
  }
}
