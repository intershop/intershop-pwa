import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { isServerConfigurationLoaded } from 'ish-core/store/core/server-config/server-config.selectors';

@Injectable({ providedIn: 'root' })
export class MaintenanceGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}

  canActivate(): boolean {
    this.store
      .pipe(
        select(isServerConfigurationLoaded),
        filter(isConfigLoaded => isConfigLoaded)
      )
      .subscribe(() => {
        this.router.navigateByUrl('/home');
      });
    return true;
  }
}
