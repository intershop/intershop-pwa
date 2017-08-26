import { HeaderSlotComponent } from './header.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockComponent } from '../../../shared/components/mock.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';

describe('Header Slot Component', () => {
  let fixture: ComponentFixture<HeaderSlotComponent>,
    component: HeaderSlotComponent,
    element: HTMLElement,
    debugEl: DebugElement

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CollapseModule],
      providers: [],
      declarations: [
        HeaderSlotComponent,
        MockComponent({ selector: 'is-loginstatus', template: 'Login Status Template' }),
        MockComponent({ selector: 'is-productcomparestatus', template: 'Product Compare Status Template' }),
        MockComponent({ selector: 'is-wishlist-status', template: 'Wish List Template'}),
        MockComponent({ selector: 'is-languageswitch', template: 'Language Switch Template' }),
        MockComponent({ selector: 'is-logo', template: 'Logo Template' }),
        MockComponent({ selector: 'is-searchbox', template: 'Search Box Template' }),
        MockComponent({ selector: 'is-headernavigation', template: 'Header Navigation Template' }),
        MockComponent({ selector: 'is-minicart', template: 'Mini Cart Template' }),
      ]
    }).compileComponents().then( () => {
      fixture = TestBed.createComponent(HeaderSlotComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      debugEl = fixture.debugElement;
    });

  }));

  it('should check "User Links" are rendered on template', () => {
    expect(element.getElementsByClassName('user-links')[0].childElementCount).toBe(4);
    expect(element.getElementsByTagName('is-loginstatus')[0].textContent).toContain('Login Status Template');
    expect(element.getElementsByTagName('is-productcomparestatus')[0].textContent).toContain('Product Compare Status Template');
    expect(element.getElementsByTagName('is-wishlist-status')[0].textContent).toContain('Wish List Template');
  });

  it('should check "LanguageSwitchComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('is-languageswitch')[0].textContent).toContain('Language Switch Template');
  });

  it('should check "LogoComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('is-logo')[0].textContent).toContain('Logo Template');
  });

  it('should check "SearchBoxComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('is-searchbox')[0].textContent).toContain('Search Box Template');
  });

  it('should check "HeaderNavigationComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('is-headerNavigation')[0].textContent).toContain('Header Navigation Template');
  });

  it('should check "MinicartComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('is-minicart')[0].textContent).toContain('Mini Cart Template');
  });
});

