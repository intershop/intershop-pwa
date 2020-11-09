import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';

@Pipe({ name: 'ishServerSetting', pure: false })
export class ServerSettingPipe implements PipeTransform, OnDestroy {
  private returnValue: unknown;

  private destroy$ = new Subject();
  private sub: Subscription;

  constructor(private appFacade: AppFacade) {}

  transform(path: string) {
    if (this.sub) {
      return this.returnValue;
    } else {
      this.sub = this.appFacade
        .serverSetting$(path)
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          this.returnValue = value;
        });
      return this.returnValue;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
