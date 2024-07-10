import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';

import { AccountHierarchiesPageComponent } from './account-hierarchies-page.component';
import { AccountHierarchiesComponent } from './account-hierarchies/account-hierarchies.component';

describe('Account Hierarchies Page Component', () => {
  let component: AccountHierarchiesPageComponent;
  let fixture: ComponentFixture<AccountHierarchiesPageComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AccountHierarchiesPageComponent, MockComponent(AccountHierarchiesComponent)],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountHierarchiesPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
  it('should render account hierarchies component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-account-hierarchies')).toBeTruthy();
  });
});
