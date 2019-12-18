import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { FilterValueMap } from 'ish-core/models/filter/filter.interface';
import { Filter } from 'ish-core/models/filter/filter.model';
import { SanitizePipe } from 'ish-core/pipes/sanitize.pipe';

import { FilterSwatchImagesComponent } from './filter-swatch-images.component';

describe('Filter Swatch Images Component', () => {
  let component: FilterSwatchImagesComponent;
  let fixture: ComponentFixture<FilterSwatchImagesComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterSwatchImagesComponent, SanitizePipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    const filterElement = {
      name: 'Color',
      facets: [
        { name: 'Black', count: 4, displayName: 'Black' },
        { name: 'Red', count: 5, displayName: 'Red', selected: true },
      ],
      filterValueMap: {
        Black: { type: 'colorcode', mapping: 'black' },
        Red: { type: 'colorcode', mapping: 'red' },
      } as FilterValueMap,
    } as Filter;
    fixture = TestBed.createComponent(FilterSwatchImagesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.filterElement = filterElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
