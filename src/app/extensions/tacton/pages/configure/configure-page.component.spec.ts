import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { TactonFacade } from '../../facades/tacton.facade';

import { ConfigurePageComponent } from './configure-page.component';
import { TactonBomComponent } from './tacton-bom/tacton-bom.component';
import { TactonGroupComponent } from './tacton-group/tacton-group.component';

describe('Configure Page Component', () => {
  let component: ConfigurePageComponent;
  let fixture: ComponentFixture<ConfigurePageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        ConfigurePageComponent,
        MockComponent(LoadingComponent),
        MockComponent(ProductImageComponent),
        MockComponent(TactonBomComponent),
        MockComponent(TactonGroupComponent),
      ],
      providers: [
        { provide: TactonFacade, useFactory: () => instance(mock(TactonFacade)) },
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
