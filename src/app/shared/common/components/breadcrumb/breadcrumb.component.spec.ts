import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('Breadcrumb Component', () => {
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
    component.searchTerm = undefined;
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=breadcrumb-search-term]')).toBeFalsy();
  });

  describe('trail', () => {
    it('should render items with translation keys if set', () => {
      component.trail = [{ key: 'KEY' }, { key: 'KEY2' }];
      fixture.detectChanges();
      expect(element.textContent).toContain('KEY');
      expect(element.textContent).toContain('KEY2');
    });

    it('should render items with text if set', () => {
      component.trail = [{ text: 'TEXT' }, { text: 'TEXT2' }];
      fixture.detectChanges();
      expect(element.textContent).toContain('TEXT');
      expect(element.textContent).toContain('TEXT2');
    });

    it('should render items with link if set', () => {
      component.trail = [{ link: '/LINK' }, { link: '/LINK' }];
      fixture.detectChanges();
      expect(element.querySelectorAll('a')).toHaveLength(3);
    });
  });
});
