import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CompanySwitchComponent } from './company-switch.component';

describe('Company Switch Component', () => {
  let component: CompanySwitchComponent;
  let fixture: ComponentFixture<CompanySwitchComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanySwitchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySwitchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
