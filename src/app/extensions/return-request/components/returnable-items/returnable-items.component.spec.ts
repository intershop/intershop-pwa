import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { ReturnRequestFacade } from '../../facades/return-request.facade';

import { ReturnableItemsComponent } from './returnable-items.component';

describe('Returnable Items Component', () => {
  let component: ReturnableItemsComponent;
  let fixture: ComponentFixture<ReturnableItemsComponent>;
  let element: HTMLElement;
  let returnFacade: ReturnRequestFacade;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    returnFacade = mock(ReturnRequestFacade);
    accountFacade = mock(AccountFacade);
    when(returnFacade.getReturnReasons$()).thenReturn(of([]));
    when(accountFacade.isBusinessCustomer$).thenReturn(of());
    await TestBed.configureTestingModule({
      declarations: [ReturnableItemsComponent],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: ReturnRequestFacade, useFactory: () => instance(returnFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnableItemsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.form = new FormGroup({
      checkAll: new FormControl(),
      items: new FormControl(),
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
