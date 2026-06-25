import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';

import { QuickorderAddProductsFormComponent } from '../../shared/quickorder-add-products-form/quickorder-add-products-form.component';
import { QuickorderCsvFormComponent } from '../../shared/quickorder-csv-form/quickorder-csv-form.component';

import { QuickorderPageComponent } from './quickorder-page.component';

describe('Quickorder Page Component', () => {
  let component: QuickorderPageComponent;
  let fixture: ComponentFixture<QuickorderPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickorderPageComponent],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) },
        provideTranslateService(),
      ],
    })
      .overrideComponent(QuickorderPageComponent, {
        remove: {
          imports: [
            BreadcrumbComponent,
            LoadingComponent,
            QuickorderAddProductsFormComponent,
            QuickorderCsvFormComponent,
            SkipContentLinkComponent,
          ],
        },
        add: {
          imports: [
            MockComponent(BreadcrumbComponent),
            MockComponent(LoadingComponent),
            MockComponent(QuickorderAddProductsFormComponent),
            MockComponent(QuickorderCsvFormComponent),
            MockComponent(SkipContentLinkComponent),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickorderPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
