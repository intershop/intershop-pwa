import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockPipe(DatePipe), MockPipe(PricePipe), RequisitionSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.requisition = {
      id: '4711',
      requisitionNo: '4712',
      approval: {
        status: 'pending',
        statusCode: 'PENDING',
        customerApproval: {
          approvers: [
            { firstName: 'Jack', lastName: 'Link' },
            { firstName: 'Bernhhard', lastName: 'Boldner' },
          ],
        },
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
        <dd class="col-6 col-sm-8 col-md-9">4712</dd>,
        <dd class="col-6 col-sm-8 col-md-9"></dd>,
        <dd class="col-6 col-sm-8 col-md-9">Jack Link, Bernhhard Boldner</dd>,
        <dd class="col-6 col-sm-8 col-md-9"></dd>,
        <dd class="col-6 col-sm-8 col-md-9">
        <span
          class="border border-secondary badge badge-secondary text-capitalize border-warning badge-warning"
        >
          pending
        </span>
      </dd>,
      ]
    `);
  });

  it('should display buyer view with a given rejected requisition', () => {
    component.requisition = {
      id: '4711_R',
      requisitionNo: '4712_R',
      approval: {
        status: 'rejected',
        statusCode: 'REJECTED',
        approvers: [
          { firstName: 'Bernhhard', lastName: 'Boldner', email: 'bboldner@test.intershop.de' },
          { firstName: 'Bernhhard', lastName: 'Boldner', email: 'bboldner@test.intershop.de' },
        ],
      },
    } as Requisition;

    fixture.detectChanges();
    expect(element.querySelectorAll('dd')).toMatchInlineSnapshot(`
      NodeList [
        <dd class="col-6 col-sm-8 col-md-9">4712_R</dd>,
        <dd class="col-6 col-sm-8 col-md-9"></dd>,
        <dd class="col-6 col-sm-8 col-md-9">Bernhhard Boldner</dd>,
        <dd class="col-6 col-sm-8 col-md-9"></dd>,
        <dd class="col-6 col-sm-8 col-md-9"></dd>,
        <dd class="col-6 col-sm-8 col-md-9">
        <span
          class="border border-secondary badge badge-secondary text-capitalize border-danger badge-danger"
        >
          rejected
        </span>
      </dd>,
      ]
    `);
  });

  it('should display approver view if there is a requisition given', () => {
    component.view = 'approver';

    fixture.detectChanges();
    expect(element.querySelectorAll('dd')).toMatchInlineSnapshot(`
      NodeList [
        <dd class="col-6 col-sm-8 col-md-9">4712</dd>,
        <dd class="col-6 col-sm-8 col-md-9"></dd>,
        <dd class="col-6 col-sm-8 col-md-9">Patricia Miller</dd>,
        <dd class="col-6 col-sm-8 col-md-9"></dd>,
        <dd class="col-6 col-sm-8 col-md-9">
        <span
          class="border border-secondary badge badge-secondary text-capitalize border-warning badge-warning"
        >
          pending
        </span>
      </dd>,
      ]
    `);
  });
});
