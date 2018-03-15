import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from '../../../utils/dev/mock.component';
import { OrderHistoryPageComponent } from './order-history-page.component';

describe('Order History Page Component', () => {
  let component: OrderHistoryPageComponent;
  let fixture: ComponentFixture<OrderHistoryPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderHistoryPageComponent,
        MockComponent({
          selector: 'ish-account-navigation',
          template: 'Account Naviation Component'
        })
      ],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
