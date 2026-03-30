import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsyncPipe } from '@angular/common';
import { RouterLink, provideRouter } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { RequisitionsListComponent } from '../../components/requisitions-list/requisitions-list.component';
import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';

import { BuyerPageComponent } from './buyer-page.component';

describe('Buyer Page Component', () => {
  let component: BuyerPageComponent;
  let fixture: ComponentFixture<BuyerPageComponent>;
  let element: HTMLElement;
  let reqFacade: RequisitionManagementFacade;

  beforeEach(async () => {
    reqFacade = mock(RequisitionManagementFacade);
    await TestBed.configureTestingModule({
      imports: [BuyerPageComponent, TranslateModule.forRoot()],
      providers: [{ provide: RequisitionManagementFacade, useFactory: () => instance(reqFacade) }, provideRouter([])],
    })
      .overrideComponent(BuyerPageComponent, {
        set: {
          imports: [
            AsyncPipe,
            MockComponent(ErrorMessageComponent),
            MockComponent(LoadingComponent),
            NgbNavModule,
            MockComponent(RequisitionsListComponent),
            RouterLink,
            TranslatePipe,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(reqFacade.requisitionsStatus$).thenReturn(of('PENDING'));
    when(reqFacade.requisitionsLoading$).thenReturn(of(false));
    when(reqFacade.requisitionsError$).thenReturn(EMPTY);
    when(reqFacade.requisitionsByRoute$).thenReturn(of([]));
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

  it('should display pending tab as active if status is PENDING', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=tab-link-pending]').getAttribute('class')).toContain('active');
  });

  it('should display approved tab as active if status is APPROVED', () => {
    when(reqFacade.requisitionsStatus$).thenReturn(of('APPROVED'));
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=tab-link-approved]').getAttribute('class')).toContain('active');
  });

  it('should display rejected tab as active if status is REJECTED', () => {
    when(reqFacade.requisitionsStatus$).thenReturn(of('REJECTED'));
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=tab-link-rejected]').getAttribute('class')).toContain('active');
  });
});
