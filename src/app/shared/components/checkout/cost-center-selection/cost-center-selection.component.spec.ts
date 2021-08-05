import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterSelectionComponent } from './cost-center-selection.component';

describe('Cost Center Selection Component', () => {
  let component: CostCenterSelectionComponent;
  let fixture: ComponentFixture<CostCenterSelectionComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostCenterSelectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterSelectionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
