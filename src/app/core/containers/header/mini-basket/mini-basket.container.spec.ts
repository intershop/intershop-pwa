import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { MiniBasketContainerComponent } from './mini-basket.container';

describe('Mini Basket Container', () => {
  let component: MiniBasketContainerComponent;
  let fixture: ComponentFixture<MiniBasketContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-mini-basket',
          template: 'Mini Basket',
          inputs: ['basket'],
        }),
        MiniBasketContainerComponent,
      ],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MiniBasketContainerComponent);
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
