import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
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
      imports: [NgbPopoverModule, TranslateModule.forRoot()],
      declarations: [BudgetInfoComponent, MockComponent(FaIconComponent), MockPipe(ServerSettingPipe, () => true)],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
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
