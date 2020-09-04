import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';

import { QuotingFacade } from '../facades/quoting.facade';

@Injectable({ providedIn: 'root' })
export class InitializeQuotingGuard implements CanActivate, CanActivateChild {
  constructor(private quotingFacade: QuotingFacade) {}

  canActivate(): boolean {
    this.quotingFacade.loadInitial();
    return true;
  }
  canActivateChild(): boolean {
    this.quotingFacade.loadInitial();
    return true;
  }
}
