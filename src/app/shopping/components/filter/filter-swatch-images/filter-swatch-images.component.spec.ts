import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { IconModule } from '../../../../core/icon.module';
import { Filter } from '../../../../models/filter/filter.model';

import { FilterSwatchImagesComponent } from './filter-swatch-images.component';

describe('Filter Swatch Images Component', () => {
  let component: FilterSwatchImagesComponent;
  let fixture: ComponentFixture<FilterSwatchImagesComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbCollapseModule, IconModule],
      declarations: [FilterSwatchImagesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    const filterElement = {
      name: 'Color',
      facets: [
        { name: 'ColorBlack', count: 4, link: { title: 'Black' } },
        { name: 'ColorRed', count: 5, link: { title: 'Red' }, selected: true },
      ],
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

  it(
    'should toggle all swatch images when filter group header is clicked',
    fakeAsync(() => {
      fixture.detectChanges();
      const filterGroupHead = fixture.nativeElement.querySelectorAll('h3')[0];
      filterGroupHead.click();
      tick(500);
      fixture.detectChanges();

      const hiddenFilterFacet = element.getElementsByTagName('ul')[0];
      expect(hiddenFilterFacet.className).not.toContain('show');
    })
  );
});
