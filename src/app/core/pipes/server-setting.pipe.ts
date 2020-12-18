import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';

/**
 * Pipe
 *
 * Used on a string, this pipe will return the corresponding server setting by checking the general/serverConfig store.
 * If it is set, the Pipe will return a truthy value.
 *
 * @example
 * <example *ngIf="'services.ABC.runnable' | ishServerSetting"> ...</example>
 */
@Pipe({ name: 'ishServerSetting', pure: false })
export class ServerSettingPipe implements PipeTransform, OnDestroy {
  private returnValue: unknown;

  private destroy$ = new Subject();
  private sub: Subscription;

  constructor(private appFacade: AppFacade) {}

  transform(path: string) {
    if (path === 'always') {
      return true;
    } else if (path === 'never') {
      return false;
    } else {
      if (!this.sub) {
        this.sub = this.appFacade
          .serverSetting$(path)
          .pipe(takeUntil(this.destroy$))
          .subscribe(value => {
            this.returnValue = value;
          });
      }
      return this.returnValue;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
