import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';

import { BudgetInfoComponent } from './budget-info.component';

describe('Budget Info Component', () => {
  let component: BudgetInfoComponent;
  let fixture: ComponentFixture<BudgetInfoComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbPopover, TranslatePipe],
      declarations: [BudgetInfoComponent, MockPipe(ServerSettingPipe, () => true)],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be display the tooltip info icon', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=budgetPriceTypeInfoTestingID]')).toBeTruthy();
  });
});
