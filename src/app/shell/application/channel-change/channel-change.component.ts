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
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-channel-change',
  templateUrl: './channel-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelChangeComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('template') modalDialogTemplate: TemplateRef<unknown>;

  ngbModalRef: NgbModalRef;

  locales: Observable<Array<Locale>>;

  private destroy$ = new Subject();

  browserLang = this.translateService.getBrowserLang();

  currentChannel: string;

  selectedChannel = 'de';

  selectedLang: string;

  constructor(private ngbModal: NgbModal, private translateService: TranslateService, private appFacade: AppFacade) {}

  ngOnInit() {
    this.appFacade.currentLocale$
      .pipe(whenTruthy(), takeUntil(this.destroy$))
      .subscribe(locale => (this.selectedLang = locale.lang));

    this.locales = this.appFacade.availableLocales$;
    this.locales.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(locales => {
      for (const locale of locales) {
        if (locale.value === this.browserLang) {
          this.selectedChannel = locale.value;
        }
      }
    });
  }

  ngAfterViewInit() {
    const preferredChannel = localStorage.getItem('preferredChannel');
    const urlStringArray = window.location.href.split('/');
    this.currentChannel = urlStringArray[3];

    if (this.currentChannel === '' || this.currentChannel === null || this.currentChannel === 'undefined') {
      this.linkToDefault();
    }

    if (preferredChannel === null || preferredChannel === 'undefined') {
      this.show();
    } else {
      this.locales
        .pipe(
          whenTruthy(),
          map(locales => locales.filter(locale => locale.value === preferredChannel)),
          takeUntil(this.destroy$)
        )
        .subscribe(locales => {
          if (locales.length < 1) {
            this.show();
          } else if (this.currentChannel !== locales[0].value) {
            this.linkToNewChannel(locales[0].value, locales[0].lang);
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  show() {
    this.ngbModalRef = this.ngbModal.open(this.modalDialogTemplate);
  }

  hide() {
    this.ngbModalRef.close();
  }

  linkToDefault() {
    let href = window.location.href;
    href = href.substring(0, href.lastIndexOf('/'));

    this.appFacade.setLocale('de_DE');
    window.location.href = `${href}/de/home`;
  }

  linkToNewChannel(newChannel, lang) {
    this.appFacade.setLocale(lang);
    window.location.href = window.location.href.replace(`/${this.currentChannel}/`, `/${newChannel}/`);
  }

  changeCountry(value, lang) {
    this.selectedChannel = value;
    this.selectedLang = lang;
  }

  confirm() {
    localStorage.setItem('preferredChannel', this.selectedChannel);
    this.hide();
    this.linkToNewChannel(this.selectedChannel, this.selectedLang);
  }
}
