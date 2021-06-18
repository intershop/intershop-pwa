import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { MakeHrefPipe } from 'ish-core/pipes/make-href.pipe';

import { CurrencySwitchComponent } from './currency-switch.component';

describe('Currency Switch Component', () => {
  let component: CurrencySwitchComponent;
  let fixture: ComponentFixture<CurrencySwitchComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;
  const currencies = ['USD', 'YEN', 'EUR'];

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    when(appFacade.availableCurrencies$).thenReturn(of(currencies));
    when(appFacade.currentCurrency$).thenReturn(of(currencies[0]));
    when(appFacade.currentLocale$).thenReturn(of('en_US'));

    await TestBed.configureTestingModule({
      declarations: [CurrencySwitchComponent, MakeHrefPipe, MockComponent(FaIconComponent)],
      imports: [NgbDropdownModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencySwitchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const router = TestBed.inject(Router);
    router.initialNavigation();

    const translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.set('locale.currency.EUR', 'Euro');
    translate.set('locale.currency.YEN', 'Yen');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show the available language options when rendered', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('li')).toHaveLength(2);
    expect(element.querySelectorAll('[href]')).toMatchInlineSnapshot(`
      NodeList [
        <a href="/;redirect=1;lang=en_US;currency=YEN"> Yen </a>,
        <a href="/;redirect=1;lang=en_US;currency=EUR"> Euro </a>,
      ]
    `);
    expect(element.querySelector('.language-switch-current-selection').textContent).toMatchInlineSnapshot(`"$"`);
  });
});
