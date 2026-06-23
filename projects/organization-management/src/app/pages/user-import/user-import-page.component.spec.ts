import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { UserImportPageComponent } from './user-import-page.component';

describe('User Import Page Component', () => {
  let component: UserImportPageComponent;
  let fixture: ComponentFixture<UserImportPageComponent>;
  let element: HTMLElement;

  let organizationManagementFacade: OrganizationManagementFacade;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [UserImportPageComponent],
      providers: [
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) },
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImportPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
