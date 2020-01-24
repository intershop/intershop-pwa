import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { HeaderNavigationComponent } from 'ish-shell/header/header-navigation/header-navigation.component';
import { LanguageSwitchComponent } from 'ish-shell/header/language-switch/language-switch.component';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';
import { MiniBasketComponent } from 'ish-shell/header/mini-basket/mini-basket.component';
import { ProductCompareStatusComponent } from 'ish-shell/header/product-compare-status/product-compare-status.component';
import { SearchBoxComponent } from 'ish-shell/header/search-box/search-box.component';
import { UserInformationMobileComponent } from 'ish-shell/header/user-information-mobile/user-information-mobile.component';

import { HeaderDefaultComponent } from './header-default.component';

describe('Header Default Component', () => {
  let fixture: ComponentFixture<HeaderDefaultComponent>;
  let element: HTMLElement;
  let component: HeaderDefaultComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: { configuration: configurationReducer },
          config: {
            initialState: { configuration: { features: ['compare'] } },
          },
        }),
      ],
      declarations: [
        HeaderDefaultComponent,
        MockComponent(FaIconComponent),
        MockComponent(HeaderNavigationComponent),
        MockComponent(LanguageSwitchComponent),
        MockComponent(LoginStatusComponent),
        MockComponent(MiniBasketComponent),
        MockComponent(NgbCollapse),
        MockComponent(ProductCompareStatusComponent),
        MockComponent(SearchBoxComponent),
        MockComponent(UserInformationMobileComponent),
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeaderDefaultComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render User Links on template', () => {
      expect(findAllIshElements(element)).toIncludeAllMembers(['ish-login-status', 'ish-product-compare-status']);
    });
    it('should render Language Switch on template', () => {
      expect(findAllIshElements(element)).toContain('ish-language-switch');
    });

    it('should render Search Box on template', () => {
      expect(findAllIshElements(element)).toContain('ish-search-box');
    });

    it('should render Header Navigation on template', () => {
      expect(findAllIshElements(element)).toContain('ish-header-navigation');
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
      component.deviceType = 'pc';
      fixture.detectChanges();

      expect(element).toMatchSnapshot();
    });

    it('should render sticky header adequately for desktop', () => {
      component.deviceType = 'pc';
      component.isSticky = true;
      fixture.detectChanges();

      expect(element).toMatchSnapshot();
    });
  });
});
