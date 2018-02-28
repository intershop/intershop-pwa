import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { MiniCartComponent } from './mini-cart.component';

describe('Mini Cart Component', () => {
  let fixture: ComponentFixture<MiniCartComponent>;
  let component: MiniCartComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CollapseModule.forRoot(),
      ],
      declarations: [
        MiniCartComponent
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(MiniCartComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  it('should calculate the correct output for price and number of items', () => {
    const cartItems = [
      { salePrice: { value: 20 } },
      { salePrice: { value: 40 } },
    ];
    component.cartItems = cartItems;

    component.ngOnChanges();

    expect(component.cartPrice).toEqual(60);
    expect(component.cartLength).toEqual(2);
  });

});
