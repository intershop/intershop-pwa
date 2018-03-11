import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { MobileCartContainerComponent } from './mobile-cart.container';

describe('Mobile Cart Container', () => {
  let component: MobileCartContainerComponent;
  let fixture: ComponentFixture<MobileCartContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-mobile-cart',
          template: 'Mobile Cart',
          inputs: ['cartItems'],
        }),
        MobileCartContainerComponent,
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(MobileCartContainerComponent);
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
