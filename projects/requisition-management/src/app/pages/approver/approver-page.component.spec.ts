import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { RequisitionsListComponent } from '../../components/requisitions-list/requisitions-list.component';
import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';

import { ApproverPageComponent } from './approver-page.component';

describe('Approver Page Component', () => {
  let component: ApproverPageComponent;
  let fixture: ComponentFixture<ApproverPageComponent>;
  let element: HTMLElement;
  let reqFacade: RequisitionManagementFacade;

  beforeEach(async(() => {
    reqFacade = mock(RequisitionManagementFacade);
    TestBed.configureTestingModule({
      imports: [NgbNavModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        ApproverPageComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
        MockComponent(RequisitionsListComponent),
      ],
      providers: [{ provide: RequisitionManagementFacade, useFactory: () => instance(reqFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(reqFacade.requisitionsStatus$).thenReturn(of('pending'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display loading overlay if requisitions are loading', () => {
    when(reqFacade.requisitionsLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should display pending tab as active if status is pending', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=tab-link-pending]').getAttribute('class')).toContain('active');
  });

  it('should display approved tab as active if status is approved', () => {
    when(reqFacade.requisitionsStatus$).thenReturn(of('approved'));
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=tab-link-approved]').getAttribute('class')).toContain('active');
  });

  it('should display rejected tab as active if status is rejected', () => {
    when(reqFacade.requisitionsStatus$).thenReturn(of('rejected'));
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=tab-link-rejected]').getAttribute('class')).toContain('active');
  });
});
