import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';

import { BuyerPageComponent } from './buyer-page.component';

describe('Buyer Page Component', () => {
  let component: BuyerPageComponent;
  let fixture: ComponentFixture<BuyerPageComponent>;
  let element: HTMLElement;
  let requisitionManagementFacade: RequisitionManagementFacade;

  beforeEach(async(() => {
    requisitionManagementFacade = mock(RequisitionManagementFacade);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [BuyerPageComponent, MockComponent(ErrorMessageComponent), MockComponent(LoadingComponent)],
      providers: [{ provide: RequisitionManagementFacade, useFactory: () => instance(requisitionManagementFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
