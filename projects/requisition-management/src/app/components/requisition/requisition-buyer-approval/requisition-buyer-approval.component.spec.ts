import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';

import { RequisitionBuyerApprovalComponent } from './requisition-buyer-approval.component';

describe('Requisition Buyer Approval Component', () => {
  let component: RequisitionBuyerApprovalComponent;
  let fixture: ComponentFixture<RequisitionBuyerApprovalComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(InfoBoxComponent), MockPipe(PricePipe), RequisitionBuyerApprovalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionBuyerApprovalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
