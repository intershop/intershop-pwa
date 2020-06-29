import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('Breadcrumb Component', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let component: BreadcrumbComponent;
  let element: HTMLElement;
  let translate: TranslateService;
  let appFacade: AppFacade;

  beforeEach(() => {
    appFacade = mock(AppFacade);
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    });
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.set('account.my_account.link', 'My Account');
    translate.set('account.order_history.link', 'Orders');
    translate.set('common.home.link', 'Home');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('breadcrumbtrail from property trail', () => {
    it('should render trail from home and trail with translation keys if set', () => {
      when(appFacade.breadcrumbData$).thenReturn(of([{ key: 'KEY' }, { key: 'KEY2' }]));
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/KEY/KEY2"`);
    });

    it('should render trail from home and trail with text if set', () => {
      when(appFacade.breadcrumbData$).thenReturn(of([{ text: 'TEXT' }, { text: 'TEXT2' }]));
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/TEXT/TEXT2"`);
    });

    it('should render trail from home and with link if set', () => {
      when(appFacade.breadcrumbData$).thenReturn(
        of([
          { link: '/LINK', text: 'L1' },
          { link: '/LINK', text: 'L2' },
        ])
      );
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/L1/L2"`);
    });
  });

  describe('breadcrumbtrail from account', () => {
    it('should render breadcrumbtrail from account and trail when account is active', () => {
      component.showHome = false;
      component.account = true;
      when(appFacade.breadcrumbData$).thenReturn(of([{ key: 'account.order_history.link' }]));
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"My Account/Orders"`);
    });

    it('should render breadcrumbtrail from home and account and trail when account is active', () => {
      component.account = true;
      when(appFacade.breadcrumbData$).thenReturn(of([{ key: 'account.order_history.link' }]));
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/My Account/Orders"`);
      expect(element.textContent).toContain('My Account');
    });
  });
});
