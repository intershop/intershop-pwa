import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { HeaderNavigationComponent } from 'ish-shell/header/header-navigation/header-navigation.component';
import { LanguageSwitchComponent } from 'ish-shell/header/language-switch/language-switch.component';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';
import { MiniBasketComponent } from 'ish-shell/header/mini-basket/mini-basket.component';
import { ProductCompareStatusComponent } from 'ish-shell/header/product-compare-status/product-compare-status.component';
import { UserInformationMobileComponent } from 'ish-shell/header/user-information-mobile/user-information-mobile.component';
import { LazySearchBoxComponent } from 'ish-shell/shared/lazy-search-box/lazy-search-box.component';

import { LazyHeaderQuickorderComponent } from '../../../extensions/quickorder/exports/lazy-header-quickorder/lazy-header-quickorder.component';
import { LazyWishlistsLinkComponent } from '../../../extensions/wishlists/exports/lazy-wishlists-link/lazy-wishlists-link.component';

import { HeaderDefaultComponent } from './header-default.component';

describe('Header Default Component', () => {
  let fixture: ComponentFixture<HeaderDefaultComponent>;
  let element: HTMLElement;
  let component: HeaderDefaultComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('compare'), TranslateModule.forRoot()],
      declarations: [
        HeaderDefaultComponent,
        MockComponent(FaIconComponent),
        MockComponent(HeaderNavigationComponent),
        MockComponent(LanguageSwitchComponent),
        MockComponent(LazyHeaderQuickorderComponent),
        MockComponent(LazySearchBoxComponent),
        MockComponent(LazyWishlistsLinkComponent),
        MockComponent(LoginStatusComponent),
        MockComponent(MiniBasketComponent),
        MockComponent(NgbCollapse),
        MockComponent(ProductCompareStatusComponent),
        MockComponent(UserInformationMobileComponent),
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
    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-login-status', 'ish-product-compare-status']);
  });
  it('should render Language Switch on template', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toContain('ish-language-switch');
  });

  it('should render Search Box on template', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toContain('ish-lazy-search-box');
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
