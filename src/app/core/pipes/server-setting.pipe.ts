import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';

@Pipe({ name: 'ishServerSetting', pure: false })
export class ServerSettingPipe implements PipeTransform, OnDestroy {
  private returnValue: unknown;

  private destroy$ = new Subject();

  constructor(private appFacade: AppFacade, private cdRef: ChangeDetectorRef) {}

  transform(path: string) {
    this.appFacade
      .serverSetting$(path)
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.returnValue = value;
        this.cdRef.markForCheck();
      });

    return this.returnValue;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
