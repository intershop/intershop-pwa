import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FeatureToggleModule } from '../../../../shared/feature-toggle.module';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { IconModule } from '../../../icon.module';
import { HeaderComponent } from './header.component';

describe('Header Component', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let element: HTMLElement;
  let component: HeaderComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CollapseModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FeatureToggleModule.testingFeatures({ compare: true }),
        IconModule,
      ],
      declarations: [
        HeaderComponent,
        MockComponent({ selector: 'ish-login-status-container', template: 'Login Status Container' }),
        MockComponent({
          selector: 'ish-product-compare-status-container',
          template: 'Product Compare Status Container',
        }),
        MockComponent({ selector: 'ish-language-switch-container', template: 'Language Switch Container' }),
        MockComponent({
          selector: 'ish-search-box-container',
          template: 'Search Box Container',
          inputs: ['configuration'],
        }),
        MockComponent({ selector: 'ish-header-navigation-container', template: 'Header Navigation Container' }),
        MockComponent({ selector: 'ish-mini-basket-container', template: 'Mini Basket Container' }),
        MockComponent({ selector: 'ish-mobile-basket-container', template: 'Mobile Basket Container' }),
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
      expect(element.getElementsByTagName('ish-login-status-container')[0].textContent).toContain(
        'Login Status Container'
      );
      expect(element.getElementsByTagName('ish-product-compare-status-container')[0].textContent).toContain(
        'Product Compare Status Container'
      );
    });

    it('should render Language Switch on template', () => {
      expect(element.getElementsByTagName('ish-language-switch-container')[0].textContent).toContain(
        'Language Switch Container'
      );
    });

    it('should render Search Box on template', () => {
      expect(element.getElementsByTagName('ish-search-box-container')[0].textContent).toContain('Search Box Container');
    });

    it('should render Header Navigation on template', () => {
      expect(element.getElementsByTagName('ish-header-navigation-container')[0].textContent).toContain(
        'Header Navigation Container'
      );
    });

    it('should render Basket on template', () => {
      expect(element.getElementsByTagName('ish-mobile-basket-container')[0].textContent).toContain(
        'Mobile Basket Container'
      );
      expect(element.getElementsByTagName('ish-mini-basket-container')[0].textContent).toContain(
        'Mini Basket Container'
      );
    });
  });
});
