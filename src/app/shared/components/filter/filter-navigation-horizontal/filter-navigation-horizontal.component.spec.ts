import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FilterNavigationHorizontalComponent } from './filter-navigation-horizontal.component';

describe('Filter Navigation Horizontal Component', () => {
  let component: FilterNavigationHorizontalComponent;
  let fixture: ComponentFixture<FilterNavigationHorizontalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterNavigationHorizontalComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
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
