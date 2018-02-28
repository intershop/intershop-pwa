import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { MiniCartContainerComponent } from './mini-cart.container';

describe('Mini Cart Container', () => {
  let component: MiniCartContainerComponent;
  let fixture: ComponentFixture<MiniCartContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-mini-cart',
          template: 'Mini Cart',
          inputs: ['cartItems'],
        }),
        MiniCartContainerComponent,
      ],
      providers: [
        { provide: Store, useFactory: () => instance(mock(Store)) },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(MiniCartContainerComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
