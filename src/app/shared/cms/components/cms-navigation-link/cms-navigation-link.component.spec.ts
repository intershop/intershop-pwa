import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { CMSNavigationLinkComponent } from './cms-navigation-link.component';

describe('Cms Navigation Link Component', () => {
  let component: CMSNavigationLinkComponent;
  let fixture: ComponentFixture<CMSNavigationLinkComponent>;
  let element: HTMLElement;

  const pagelet = {
    definitionQualifiedName: 'dqn',
    id: 'id',
    displayName: 'name',
    domain: 'domain',
    configurationParameters: {
      Link: 'route://home',
      LinkText: 'Home',
      CSSClass: 'nav-link',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CMSNavigationLinkComponent, MockComponent(FaIconComponent), MockDirective(ServerHtmlDirective)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSNavigationLinkComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    component.pagelet = createContentPageletView(pagelet);
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown nav-link">
        <a ng-reflect-router-link="/home" style="width: 100%" href="/home"> Home </a>
      </li>
    `);
  });

  it('should render external link if set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: { ...pagelet.configurationParameters, Link: 'https://test.com', LinkText: 'External' },
    });
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(
      `<li class="dropdown nav-link"><a href="https://test.com" style="width: 100%"> External </a></li>`
    );
  });

  it('should render Sub Navigation HTML if set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: { ...pagelet.configurationParameters, SubNavigationHTML: '<span>Hello World</span>' },
    });
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown nav-link">
        <a ng-reflect-router-link="/home" href="/home"> Home </a
        ><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
        <ul class="category-level1 dropdown-menu">
          <li class="sub-navigation-content">
            <div ng-reflect-ish-server-html="<span>Hello World</span>"></div>
          </li>
        </ul>
      </li>
    `);
  });
});
