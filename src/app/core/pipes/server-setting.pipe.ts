import { DestroyRef, Pipe, PipeTransform, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

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
export class ServerSettingPipe implements PipeTransform {
  private returnValue: unknown;

  private destroyRef = inject(DestroyRef);
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
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(value => {
            this.returnValue = value;
          });
      }
      return this.returnValue;
    }
  }
}
