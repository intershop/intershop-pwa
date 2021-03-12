import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';

import { HeaderChannelChangeComponent } from './header-channel-change.component';

describe('Header Channel Change Component', () => {
  let fixture: ComponentFixture<HeaderChannelChangeComponent>;
  let element: HTMLElement;
  let component: HeaderChannelChangeComponent;
  let appFacade: AppFacade;
  const locales = [
    { lang: 'en_US', value: 'en', displayName: 'English' },
    { lang: 'de_DE', value: 'de', displayName: 'Deutsch' },
    { lang: 'fr_FR', value: 'fr', displayName: 'Fran¢aise' },
  ] as Locale[];

  beforeEach(async () => {
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      imports: [NgbModalModule, TranslateModule.forRoot()],
      declarations: [HeaderChannelChangeComponent],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderChannelChangeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(appFacade.availableLocales$).thenReturn(of(locales));
    when(appFacade.currentLocale$).thenReturn(of(locales[1]));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
