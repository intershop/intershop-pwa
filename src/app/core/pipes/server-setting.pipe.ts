import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { log } from 'ish-core/utils/dev/operators';

@Pipe({ name: 'ishServerSetting', pure: false })
export class ServerSettingPipe implements PipeTransform, OnDestroy {
  private returnValue: unknown;

  private destroy$ = new Subject();
  private sub: Subscription;

  constructor(private appFacade: AppFacade, private cdRef: ChangeDetectorRef) {}

  transform(path: string) {
    console.log('##', path);

    if (this.sub) {
      // tslint:disable-next-line: ban
      this.sub.unsubscribe();
    }

    this.sub = this.appFacade
      .serverSetting$(path)
      .pipe(log('####'), takeUntil(this.destroy$))
      .subscribe(value => {
        this.returnValue = value;
        this.cdRef.detectChanges();
      });

    return this.returnValue;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
