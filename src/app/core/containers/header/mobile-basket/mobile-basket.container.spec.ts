import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { MobileBasketContainerComponent } from './mobile-basket.container';

describe('Mobile Basket Container', () => {
  let component: MobileBasketContainerComponent;
  let fixture: ComponentFixture<MobileBasketContainerComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockComponent({
            selector: 'ish-mobile-basket',
            template: 'Mobile Basket',
            inputs: ['cartItems'],
          }),
          MobileBasketContainerComponent,
        ],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(MobileBasketContainerComponent);
          component = fixture.componentInstance;
          element = fixture.nativeElement;
        });
    })
  );

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
