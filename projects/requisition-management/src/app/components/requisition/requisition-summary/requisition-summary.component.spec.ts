import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';

import { Requisition } from '../../../models/requisition/requisition.model';

import { RequisitionSummaryComponent } from './requisition-summary.component';

describe('Requisition Summary Component', () => {
  let component: RequisitionSummaryComponent;
  let fixture: ComponentFixture<RequisitionSummaryComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [MockPipe(DatePipe), MockPipe(PricePipe), RequisitionSummaryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.requisition = {
      id: '4711',
      requisitionNo: '4712',
      approval: {
        status: 'Approval Pending',
        statusCode: 'pending',
        customerApprovers: [
          { firstName: 'Jack', lastName: 'Link' },
          { firstName: 'Bernhhard', lastName: 'Boldner' },
        ],
      },
      user: { firstName: 'Patricia', lastName: 'Miller' },
      totals: undefined,
      creationDate: 24324321,
      lineItemCount: 2,
      lineItems: undefined,
    } as Requisition;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything if there is no requisition given', () => {
    component.requisition = undefined;
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should display buyer view if there is a requisition given', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('dd')).toMatchInlineSnapshot(`
      NodeList [
        <dd class="col-6 col-sm-8 col-md-10">4712</dd>,
        <dd class="col-6 col-sm-8 col-md-10"></dd>,
        <dd class="col-6 col-sm-8 col-md-10">Jack Link , Bernhhard Boldner (Approval Pending)</dd>,
        <dd class="col-6 col-sm-8 col-md-10"></dd>,
        <dd class="col-6 col-sm-8 col-md-10">
        <span class="border border-secondary badge badge-secondary text-capitalize">
          Approval Pending</span
        >
      </dd>,
      ]
    `);
  });

  it('should display approver view if there is a requisition given', () => {
    component.view = 'approver';

    fixture.detectChanges();
    expect(element.querySelectorAll('dd')).toMatchInlineSnapshot(`
      NodeList [
        <dd class="col-6 col-sm-8 col-md-10">4712</dd>,
        <dd class="col-6 col-sm-8 col-md-10"></dd>,
        <dd class="col-6 col-sm-8 col-md-10">Patricia Miller</dd>,
        <dd class="col-6 col-sm-8 col-md-10"></dd>,
        <dd class="col-6 col-sm-8 col-md-10">
        <span class="border border-secondary badge badge-secondary text-capitalize">
          Approval Pending</span
        >
      </dd>,
      ]
    `);
  });
});
