import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { SimpleSearchBoxComponent } from 'ish-core/standalone/component/suggest/simple-search-box/simple-search-box.component';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { HeaderNavigationComponent } from 'ish-shell/header/header-navigation/header-navigation.component';
import { LanguageSwitchComponent } from 'ish-shell/header/language-switch/language-switch.component';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';
import { MiniBasketComponent } from 'ish-shell/header/mini-basket/mini-basket.component';
import { UserInformationMobileComponent } from 'ish-shell/header/user-information-mobile/user-information-mobile.component';

import { LazyProductCompareStatusComponent } from '../../../extensions/compare/exports/lazy-product-compare-status/lazy-product-compare-status.component';
import { LazyQuickorderLinkComponent } from '../../../extensions/quickorder/exports/lazy-quickorder-link/lazy-quickorder-link.component';

import { HeaderDefaultComponent } from './header-default.component';

describe('Header Default Component', () => {
  let fixture: ComponentFixture<HeaderDefaultComponent>;
  let element: HTMLElement;
  let component: HeaderDefaultComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: AppFacade, useFactory: () => instance(mock(AppFacade)) }],
      imports: [FeatureToggleModule.forTesting('compare'), TranslateModule.forRoot()],
      declarations: [
        HeaderDefaultComponent,
        MockComponent(FaIconComponent),
        MockComponent(HeaderNavigationComponent),
        MockComponent(LanguageSwitchComponent),
        MockComponent(LazyProductCompareStatusComponent),
        MockComponent(LazyQuickorderLinkComponent),
        MockComponent(LoginStatusComponent),
        MockComponent(MiniBasketComponent),
        MockComponent(SimpleSearchBoxComponent),
        MockComponent(UserInformationMobileComponent),
        MockDirective(NgbCollapse),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDefaultComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render User Links on template', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-login-status', 'ish-lazy-product-compare-status']);
  });

  it('should render Language Switch on template', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toContain('ish-language-switch');
  });

  it('should render Search Box on template', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toContain('ish-simple-search-box');
  });

  it('should render Header Navigation on template', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toContain('ish-header-navigation');
  });

  it('should render normal header adequately for mobile devices', () => {
    component.deviceType = 'mobile';
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });

  it('should render sticky header adequately for mobile devices', () => {
    component.deviceType = 'mobile';
    component.isSticky = true;
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });

  it('should render normal header adequately for tablet devices', () => {
    component.deviceType = 'tablet';
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });

  it('should render sticky header adequately for tablet devices', () => {
    component.deviceType = 'tablet';
    component.isSticky = true;
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });

  it('should render normal header adequately for desktop', () => {
    component.deviceType = 'desktop';
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });

  it('should render sticky header adequately for desktop', () => {
    component.deviceType = 'desktop';
    component.isSticky = true;
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });
});
