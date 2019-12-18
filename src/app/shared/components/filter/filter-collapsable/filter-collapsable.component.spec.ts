import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MockComponent } from 'ng-mocks';

import { FilterCollapsableComponent } from './filter-collapsable.component';

describe('Filter Collapsable Component', () => {
  let component: FilterCollapsableComponent;
  let fixture: ComponentFixture<FilterCollapsableComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbCollapseModule],
      declarations: [FilterCollapsableComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCollapsableComponent);
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
    expect(element).toMatchSnapshot('open');
    const filterGroupHead = fixture.nativeElement.querySelectorAll('h3')[0];
    filterGroupHead.click();
    tick(500);
    fixture.detectChanges();

    expect(element).toMatchSnapshot('closed');
  }));
});
