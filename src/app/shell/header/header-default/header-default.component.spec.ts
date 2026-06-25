import { CommonModule, NgClass, NgTemplateOutlet } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink, provideRouter } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleDirective, FeatureToggleModule } from 'ish-core/feature-toggle.imports';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { SearchBoxComponent } from 'ish-shared/components/search/search-box/search-box.component';
import { HeaderNavigationComponent } from 'ish-shell/header/header-navigation/header-navigation.component';
import { LanguageSwitchComponent } from 'ish-shell/header/language-switch/language-switch.component';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';
import { MiniBasketComponent } from 'ish-shell/header/mini-basket/mini-basket.component';
import { UserInformationMobileComponent } from 'ish-shell/header/user-information-mobile/user-information-mobile.component';

import { ProductCompareStatusComponent } from '../../../extensions/compare/shared/product-compare-status/product-compare-status.component';
import { QuickorderLinkComponent } from '../../../extensions/quickorder/shared/quickorder-link/quickorder-link.component';
import { WishlistsLinkComponent } from '../../../extensions/wishlists/shared/wishlists-link/wishlists-link.component';

import { HeaderDefaultComponent } from './header-default.component';

describe('Header Default Component', () => {
  let fixture: ComponentFixture<HeaderDefaultComponent>;
  let element: HTMLElement;
  let component: HeaderDefaultComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HeaderDefaultComponent],
      providers: [
        ...(FeatureToggleModule.forTesting('compare').providers ?? []),
        provideRouter([]),
        provideTranslateService(),
      ],
    })
      .overrideComponent(HeaderDefaultComponent, {
        set: {
          imports: [
            MockComponent(SearchBoxComponent),
            NgClass,
            MockComponent(LoginStatusComponent),
            MockComponent(ProductCompareStatusComponent),
            MockComponent(QuickorderLinkComponent),
            MockComponent(WishlistsLinkComponent),
            FeatureToggleDirective,
            NgbCollapseModule,
            NgTemplateOutlet,
            MockComponent(LanguageSwitchComponent),
            MockComponent(MiniBasketComponent),
            RouterLink,
            MockComponent(HeaderNavigationComponent),
            MockComponent(UserInformationMobileComponent),
            TranslatePipe,
          ],
        },
      })
      .compileComponents();
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
    expect(findAllCustomElements(element)).toContain('ish-login-status');
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
});
