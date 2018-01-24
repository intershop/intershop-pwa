import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { AccountPageComponent } from './account-page.component';

describe('Account Overview Component', () => {
  let fixture: ComponentFixture<AccountPageComponent>;
  let component: AccountPageComponent;
  let element: HTMLElement;
  let accountLoginService: AccountLoginService;
  let location: Location;

  beforeEach(async(() => {
    const accountLoginServiceMock = mock(AccountLoginService);

    TestBed.configureTestingModule({
      declarations: [AccountPageComponent, BreadcrumbComponent],
      providers: [
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
        { provide: CategoriesService, useFactory: () => instance(mock(CategoriesService)) },
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: AccountPageComponent }
        ]),
        TranslateModule.forRoot(),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    accountLoginService = TestBed.get(AccountLoginService);
    location = TestBed.get(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
