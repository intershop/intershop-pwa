import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { HierarchySwitchComponent } from './hierarchy-switch.component';

describe('Hierarchy Switch Component', () => {
  let component: HierarchySwitchComponent;
  let fixture: ComponentFixture<HierarchySwitchComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HierarchySwitchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchySwitchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
