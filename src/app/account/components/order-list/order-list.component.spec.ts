import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { OrderView } from '../../../models/order/order.model';
import { PipesModule } from '../../../shared/pipes.module';
import { MockComponent } from '../../../utils/dev/mock.component';

import { OrderListComponent } from './order-list.component';

describe('Order List Component', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderListComponent,
        MockComponent({
          selector: 'ish-address',
          template: 'Address Component',
          inputs: ['address'],
        }),
      ],
      imports: [TranslateModule.forRoot(), PipesModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.orders = [
      { id: '00123', documentNo: '123', totals: {} },
      { id: '00124', documentNo: '124', totals: {} },
    ] as OrderView[];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list text if there are no orders', () => {
    component.orders = [];
    fixture.detectChanges();
    expect(element.querySelector('p[data-testing-id=emptyList]')).toBeTruthy();
  });

  it('should display a list if there are orders', () => {
    fixture.detectChanges();

    expect(element.querySelector('div.list-body')).toBeTruthy();
    expect(element.querySelectorAll('div.list-item-row')).toHaveLength(2);
    expect(element.querySelector('ish-address')).toBeTruthy();
  });

  it('should display a certain number of items if maxItemsCount is set', () => {
    component.maxListItems = 1;
    fixture.detectChanges();

    expect(element.querySelectorAll('div.list-item-row')).toHaveLength(1);
  });

  it('should not display addresses if compact is set to true', () => {
    component.compact = true;
    fixture.detectChanges();

    expect(element.querySelector('ish-address')).toBeFalsy();
  });
});
