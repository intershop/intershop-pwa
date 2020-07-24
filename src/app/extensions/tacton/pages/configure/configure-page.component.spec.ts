import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

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

  beforeEach(async(() => {
    const tactonFacade = mock(TactonFacade);
    when(tactonFacade.conflicts$).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        ConfigurePageComponent,
        MockComponent(LoadingComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(ProductImageComponent),
        MockComponent(TactonBomComponent),
        MockComponent(TactonConfigureNavigationComponent),
        MockComponent(TactonGroupComponent),
        MockComponent(TactonStepButtonsComponent),
      ],
      providers: [
        { provide: TactonFacade, useFactory: () => instance(tactonFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
      ],
    }).compileComponents();
  }));

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
