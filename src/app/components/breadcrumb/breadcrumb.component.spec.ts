import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { instance, mock } from 'ts-mockito';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadCrumb Component', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let component: BreadcrumbComponent;
  let element: HTMLElement;
  let routerMock: Router;
  beforeEach(() => {
    routerMock = mock(Router);
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      providers: [
        { provide: Router, useFactory: () => instance(routerMock) },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });
});
