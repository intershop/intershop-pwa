import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { SearchBoxComponent } from 'ish-shared/components/search/search-box/search-box.component';
import { HeaderNavigationComponent } from 'ish-shell/header/header-navigation/header-navigation.component';
import { LanguageSwitchComponent } from 'ish-shell/header/language-switch/language-switch.component';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';
import { MiniBasketComponent } from 'ish-shell/header/mini-basket/mini-basket.component';
import { UserInformationMobileComponent } from 'ish-shell/header/user-information-mobile/user-information-mobile.component';

import { LazyProductCompareStatusComponent } from '../../../extensions/compare/exports/lazy-product-compare-status/lazy-product-compare-status.component';

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
        MockComponent(LazyProductCompareStatusComponent),
        MockComponent(LoginStatusComponent),
        MockComponent(MiniBasketComponent),
        MockComponent(SearchBoxComponent),
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
    expect(findAllCustomElements(element)).toContain('ish-search-box');
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

  describe('Sticky Header Search Button Accessibility', () => {
    it('should render search button as button element for non-mobile sticky header', () => {
      component.deviceType = 'desktop';
      component.isSticky = true;
      fixture.detectChanges();

      const searchButton = element.querySelector('.search-toggler.sticky-header-icon');
      expect(searchButton).toBeTruthy();
      expect(searchButton.tagName.toLowerCase()).toBe('button');
      expect(searchButton.getAttribute('type')).toBe('button');
    });

    it('should render search button as button element for mobile sticky header', () => {
      component.deviceType = 'mobile';
      component.isSticky = true;
      fixture.detectChanges();

      const searchButton = element.querySelector('.search-toggler.sticky-header-icon');
      expect(searchButton).toBeTruthy();
      expect(searchButton.tagName.toLowerCase()).toBe('button');
      expect(searchButton.getAttribute('type')).toBe('button');
    });

    it('should render search button as button element for tablet sticky header', () => {
      component.deviceType = 'tablet';
      component.isSticky = true;
      fixture.detectChanges();

      const searchButton = element.querySelector('.search-toggler.sticky-header-icon');
      expect(searchButton).toBeTruthy();
      expect(searchButton.tagName.toLowerCase()).toBe('button');
      expect(searchButton.getAttribute('type')).toBe('button');
    });

    it('should call scrollTopAndFocusSearch when search button is clicked', () => {
      // Mock window.scrollTo to prevent JSDOM "Not implemented" error
      const mockScrollTo = jest.fn();
      Object.defineProperty(window, 'scrollTo', { value: mockScrollTo });
      Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

      const scrollTopAndFocusSearchSpy = jest.spyOn(component, 'scrollTopAndFocusSearch');
      component.deviceType = 'desktop';
      component.isSticky = true;
      fixture.detectChanges();

      const searchButton = element.querySelector('.search-toggler.sticky-header-icon') as HTMLButtonElement;
      searchButton.click();

      expect(scrollTopAndFocusSearchSpy).toHaveBeenCalled();
    });
  });
});
