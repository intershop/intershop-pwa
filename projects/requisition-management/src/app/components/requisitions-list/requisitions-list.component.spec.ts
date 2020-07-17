import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';

import { RequisitionsListComponent } from './requisitions-list.component';

describe('Requisitions List Component', () => {
  let component: RequisitionsListComponent;
  let fixture: ComponentFixture<RequisitionsListComponent>;
  let element: HTMLElement;
  let requisitionManagementFacade: RequisitionManagementFacade;

  beforeEach(async(() => {
    requisitionManagementFacade = mock(RequisitionManagementFacade);

    TestBed.configureTestingModule({
      declarations: [MockComponent(ErrorMessageComponent), MockComponent(LoadingComponent), RequisitionsListComponent],
      providers: [{ provide: RequisitionManagementFacade, useFactory: () => instance(requisitionManagementFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionsListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
