import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';

import { TactonFacade } from '../../facades/tacton.facade';

import { ConfigurePageComponent } from './configure-page.component';
import { TactonBomComponent } from './tacton-bom/tacton-bom.component';
import { TactonConfigureNavigationComponent } from './tacton-configure-navigation/tacton-configure-navigation.component';
import { TactonGroupComponent } from './tacton-group/tacton-group.component';
import { TactonStepButtonsComponent } from './tacton-step-buttons/tacton-step-buttons.component';

describe('Configure Page Component', () => {
  let component: ConfigurePageComponent;
  let fixture: ComponentFixture<ConfigurePageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const tactonFacade = mock(TactonFacade);
    when(tactonFacade.conflicts$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        ConfigurePageComponent,
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(ProductImageComponent),
        MockComponent(TactonBomComponent),
        MockComponent(TactonConfigureNavigationComponent),
        MockComponent(TactonGroupComponent),
        MockComponent(TactonStepButtonsComponent),
      ],
      providers: [{ provide: TactonFacade, useFactory: () => instance(tactonFacade) }],
    })
      .overrideComponent(ConfigurePageComponent, {
        set: { providers: [{ provide: ProductContextFacade, useFactory: () => instance(mock(ProductContextFacade)) }] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
