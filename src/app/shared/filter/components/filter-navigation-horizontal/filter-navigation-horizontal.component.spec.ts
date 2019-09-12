import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FilterDropdownMultiselectComponent } from 'ish-shared/filter/components/filter-dropdown-multiselect/filter-dropdown-multiselect.component';

import { FilterNavigationHorizontalComponent } from './filter-navigation-horizontal.component';

describe('Filter Navigation Horizontal Component', () => {
  let component: FilterNavigationHorizontalComponent;
  let fixture: ComponentFixture<FilterNavigationHorizontalComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterNavigationHorizontalComponent, MockComponent(FilterDropdownMultiselectComponent)],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

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
