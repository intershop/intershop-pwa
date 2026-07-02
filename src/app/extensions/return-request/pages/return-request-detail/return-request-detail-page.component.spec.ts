import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock, when } from 'ts-mockito';

import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';

import { ReturnRequestProductInfoComponent } from '../../components/return-request-product-info/return-request-product-info.component';

import { ReturnRequestDetailPageComponent } from './return-request-detail-page.component';

describe('Return Request Detail Page Component', () => {
  let component: ReturnRequestDetailPageComponent;
  let fixture: ComponentFixture<ReturnRequestDetailPageComponent>;
  let element: HTMLElement;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    activatedRoute = mock(ActivatedRoute);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(InfoBoxComponent),
        MockComponent(ReturnRequestProductInfoComponent),
        ReturnRequestDetailPageComponent,
      ],
      providers: [{ provide: ActivatedRoute, useFactory: () => instance(activatedRoute) }],
    }).compileComponents();

    when(activatedRoute.snapshot).thenReturn({
      params: {},
    } as ActivatedRouteSnapshot);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRequestDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
