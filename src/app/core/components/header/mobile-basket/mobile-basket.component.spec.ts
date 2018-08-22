import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { IconModule } from '../../../icon.module';

import { MobileBasketComponent } from './mobile-basket.component';

describe('Mobile Basket Component', () => {
  let component: MobileBasketComponent;
  let fixture: ComponentFixture<MobileBasketComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconModule],
      declarations: [MobileBasketComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MobileBasketComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        component.itemCount = 0;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
