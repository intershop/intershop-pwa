import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';

import { FilterCollapsibleComponent } from './filter-collapsible.component';

describe('Filter Collapsible Component', () => {
  let component: FilterCollapsibleComponent;
  let fixture: ComponentFixture<FilterCollapsibleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterCollapsibleComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCollapsibleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should hide content when header is clicked', fakeAsync(() => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <div class="filter-group">
        <h3 tabindex="0" aria-controls="collapseFilter" aria-expanded="true">
          <fa-icon class="float-right" ng-reflect-icon="fas,angle-down"></fa-icon>
        </h3>
      </div>
    `);
    const filterGroupHead = fixture.nativeElement.querySelectorAll('h3')[0];
    filterGroupHead.click();
    tick(500);
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="filter-group collapsed">
        <h3 tabindex="0" aria-controls="collapseFilter" aria-expanded="false">
          <fa-icon class="float-right" ng-reflect-icon="fas,angle-right"></fa-icon>
        </h3>
      </div>
    `);
  }));
});
