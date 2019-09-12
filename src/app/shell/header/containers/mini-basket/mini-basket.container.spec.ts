import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { MiniBasketComponent } from 'ish-shell/header/components/mini-basket/mini-basket.component';

import { MiniBasketContainerComponent } from './mini-basket.container';

describe('Mini Basket Container', () => {
  let component: MiniBasketContainerComponent;
  let fixture: ComponentFixture<MiniBasketContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MiniBasketContainerComponent, MockComponent(MiniBasketComponent)],
      imports: [RouterTestingModule],
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
