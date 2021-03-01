import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-header-channel-change',
  templateUrl: './header-channel-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderChannelChangeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('template') modalDialogTemplate: TemplateRef<unknown>;

  ngbModalRef: NgbModalRef;

  private destroy$ = new Subject();

  locales$: Observable<Array<Locale>>;

  availableLocales: Array<Locale>;

  currentChannel: string;

  selectedChannel = 'de';

  preferredLocale: Locale;

  constructor(private ngbModal: NgbModal, private appFacade: AppFacade) {}

  ngOnInit() {
    this.locales$ = this.appFacade.availableLocales$;
    this.locales$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(locales => {
      this.availableLocales = locales;
    });
  }

  ngAfterViewInit() {
    const urlStringArray = window.location.href.split('/');
    this.currentChannel = urlStringArray[3];

    for (const locale of this.availableLocales) {
      if (this.currentChannel === locale.value) {
        this.selectedChannel = locale.value;
      }
    }
  }

  show() {
    this.ngbModalRef = this.ngbModal.open(this.modalDialogTemplate);
  }

  hide() {
    this.ngbModalRef.close();
  }

  changeCountry(locale: Locale) {
    this.preferredLocale = locale;
  }

  confirm() {
    localStorage.setItem('preferredChannel', this.preferredLocale.value);
    window.location.href = window.location.href.replace(`/${this.currentChannel}/`, `/${this.preferredLocale.value}/`);
    this.hide();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
