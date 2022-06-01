import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelGroupTypeComponent } from './panel-group-type.component';

describe('Panel Group Type Component', () => {
  let component: PanelGroupTypeComponent;
  let fixture: ComponentFixture<PanelGroupTypeComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelGroupTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelGroupTypeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
