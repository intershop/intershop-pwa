import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplatePreferencesDialogComponent } from '../order-template-preferences-dialog/order-template-preferences-dialog.component';

import { OrderCreateOrderTemplateComponent } from './order-create-order-template.component';

describe('Order Create Order Template Component', () => {
  let component: OrderCreateOrderTemplateComponent;
  let fixture: ComponentFixture<OrderCreateOrderTemplateComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(OrderTemplatePreferencesDialogComponent), OrderCreateOrderTemplateComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: OrderTemplatesFacade, useFactory: () => instance(mock(OrderTemplatesFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCreateOrderTemplateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
