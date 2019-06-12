import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { HeaderNavigationContainerComponent } from '../../containers/header-navigation/header-navigation.container';
import { LanguageSwitchContainerComponent } from '../../containers/language-switch/language-switch.container';
import { LoginStatusContainerComponent } from '../../containers/login-status/login-status.container';
import { MiniBasketContainerComponent } from '../../containers/mini-basket/mini-basket.container';
import { ProductCompareStatusContainerComponent } from '../../containers/product-compare-status/product-compare-status.container';
import { SearchBoxContainerComponent } from '../../containers/search-box/search-box.container';
import { UserInformationMobileComponent } from '../user-information-mobile/user-information-mobile.component';

import { HeaderComponent } from './header.component';

describe('Header Component', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let element: HTMLElement;
  let component: HeaderComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        IconModule,
        NgbCollapseModule,
        RouterTestingModule,
        StoreModule.forRoot(
          { configuration: configurationReducer },
          { initialState: { configuration: { features: ['compare'] } } }
        ),
        TranslateModule.forRoot(),
      ],
      declarations: [
        HeaderComponent,
        MockComponent(HeaderNavigationContainerComponent),
        MockComponent(LanguageSwitchContainerComponent),
        MockComponent(LoginStatusContainerComponent),
        MockComponent(MiniBasketContainerComponent),
        MockComponent(ProductCompareStatusContainerComponent),
        MockComponent(SearchBoxContainerComponent),
        MockComponent(UserInformationMobileComponent),
      ],
      providers: [
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeaderComponent);
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
      expect(findAllIshElements(element)).toIncludeAllMembers([
        'ish-login-status-container',
        'ish-product-compare-status-container',
      ]);
    });
    it('should render Language Switch on template', () => {
      expect(findAllIshElements(element)).toContain('ish-language-switch-container');
    });

    it('should render Search Box on template', () => {
      expect(findAllIshElements(element)).toContain('ish-search-box-container');
    });

    it('should render Header Navigation on template', () => {
      expect(findAllIshElements(element)).toContain('ish-header-navigation-container');
    });
  });
});
