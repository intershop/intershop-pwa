import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { HeaderQuickorderComponent } from './header-quickorder.component';

describe('Header Quickorder Component', () => {
  let component: HeaderQuickorderComponent;
  let fixture: ComponentFixture<HeaderQuickorderComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderQuickorderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderQuickorderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  // it('should be created', () => {
  //   expect(component).toBeTruthy();
  //   expect(element).toBeTruthy();
  //   expect(() => fixture.detectChanges()).not.toThrow();
  // });
});
