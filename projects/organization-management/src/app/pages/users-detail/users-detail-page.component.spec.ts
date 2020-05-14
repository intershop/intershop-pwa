import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { UsersDetailPageComponent } from './users-detail-page.component';

describe('Users Detail Page Component', () => {
  let component: UsersDetailPageComponent;
  let fixture: ComponentFixture<UsersDetailPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersDetailPageComponent],
      providers: [
        { provide: OrganizationManagementFacade, useFactory: () => instance(mock(OrganizationManagementFacade)) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
