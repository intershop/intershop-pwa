import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock, verify, when } from 'ts-mockito';

import { PunchoutFacade } from '../../facades/punchout.facade';

import { PunchoutTransferBasketComponent } from './punchout-transfer-basket.component';

describe('Punchout Transfer Basket Component', () => {
  let component: PunchoutTransferBasketComponent;
  let fixture: ComponentFixture<PunchoutTransferBasketComponent>;
  let element: HTMLElement;
  let punchoutFacade: PunchoutFacade;

  beforeEach(async () => {
    punchoutFacade = mock(PunchoutFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [PunchoutTransferBasketComponent],
      providers: [{ provide: PunchoutFacade, useFactory: () => instance(punchoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PunchoutTransferBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should call transferBasket at punchout facade when transferBasket is triggered', () => {
    when(punchoutFacade.transferBasket()).thenReturn(undefined);

    component.transferBasket();

    verify(punchoutFacade.transferBasket()).once();
  });
});
