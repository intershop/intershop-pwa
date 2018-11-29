import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { HeaderSimpleComponent } from './header-simple.component';

describe('Header Simple Component', () => {
  let fixture: ComponentFixture<HeaderSimpleComponent>;
  let element: HTMLElement;
  let component: HeaderSimpleComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderSimpleComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeaderSimpleComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
