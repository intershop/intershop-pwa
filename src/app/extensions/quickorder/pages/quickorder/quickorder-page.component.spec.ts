import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { QuickorderPageComponent } from './quickorder-page.component';

describe('Quickorder Page Component', () => {
  let component: QuickorderPageComponent;
  let fixture: ComponentFixture<QuickorderPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickorderPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickorderPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  // it('should be created', () => {
  //   expect(component).toBeTruthy();
  //   expect(element).toBeTruthy();
  //   expect(() => fixture.detectChanges()).not.toThrow();
  // });
});
