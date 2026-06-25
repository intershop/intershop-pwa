import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FilterDropdownComponent } from 'ish-shared/components/filter/filter-dropdown/filter-dropdown.component';

import { FilterNavigationHorizontalComponent } from './filter-navigation-horizontal.component';

describe('Filter Navigation Horizontal Component', () => {
  let component: FilterNavigationHorizontalComponent;
  let fixture: ComponentFixture<FilterNavigationHorizontalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideTranslateService()],
      imports: [FilterNavigationHorizontalComponent],
    })
      .overrideComponent(FilterNavigationHorizontalComponent, {
        remove: { imports: [FilterDropdownComponent] },
        add: { imports: [MockComponent(FilterDropdownComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNavigationHorizontalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
