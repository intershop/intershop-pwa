import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { MockComponent } from '../../../utils/dev/mock.component';
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
        RouterTestingModule
      ],
      declarations: [
        HeaderComponent,
        MockComponent({ selector: 'ish-login-status', template: 'Login Status Template' }),
        MockComponent({ selector: 'ish-product-compare-status', template: 'Product Compare Status Template' }),
        MockComponent({ selector: 'ish-language-switch', template: 'Language Switch Template' }),
        MockComponent({ selector: 'ish-search-box', template: 'Search Box Template' }),
        MockComponent({ selector: 'ish-header-navigation', template: 'Header Navigation Template' }),
        MockComponent({ selector: 'ish-mini-cart', template: 'Mini Cart Template' }),
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });

  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  it('should render User Links on template', () => {
    expect(element.getElementsByTagName('ish-login-status')[0].textContent).toContain('Login Status Template');
    expect(element.getElementsByTagName('ish-product-compare-status')[0].textContent).toContain('Product Compare Status Template');
  });

  it('should render Language Switch on template', () => {
    expect(element.getElementsByTagName('ish-language-switch')[0].textContent).toContain('Language Switch Template');
  });

  it('should render Search Box on template', () => {
    expect(element.getElementsByTagName('ish-search-box')[0].textContent).toContain('Search Box Template');
  });

  it('should render Header Navigation on template', () => {
    expect(element.getElementsByTagName('ish-header-navigation')[0].textContent).toContain('Header Navigation Template');
  });

  it('should render Mini Cart on template', () => {
    expect(element.getElementsByTagName('ish-mini-cart')[0].textContent).toContain('Mini Cart Template');
  });
});
