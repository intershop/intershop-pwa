import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadCrumb Component', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let component: BreadcrumbComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render search term when available', () => {
    component.searchTerm = 'Test Search Term';
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=breadcrumb-search-term]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=breadcrumb-search-term]').textContent).toContain(
      component.searchTerm
    );
  });

  it('should not render search term when not available', () => {
    component.searchTerm = null;
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=breadcrumb-search-term]')).toBeFalsy();
  });
});
