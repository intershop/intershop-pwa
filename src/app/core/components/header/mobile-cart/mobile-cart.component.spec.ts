import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCartComponent } from './mobile-cart.component';

describe('Mobile Cart Component', () => {
  let component: MobileCartComponent;
  let fixture: ComponentFixture<MobileCartComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [MobileCartComponent],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(MobileCartComponent);
          component = fixture.componentInstance;
          element = fixture.nativeElement;

          component.cartItems = [];
        });
    })
  );

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
