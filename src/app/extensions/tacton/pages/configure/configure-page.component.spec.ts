import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { TactonFacade } from '../../facades/tacton.facade';

import { ConfigurePageComponent } from './configure-page.component';

describe('Configure Page Component', () => {
  let component: ConfigurePageComponent;
  let fixture: ComponentFixture<ConfigurePageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const tactonFacade = mock(TactonFacade);
    when(tactonFacade.conflicts$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ConfigurePageComponent, MockComponent(ModalDialogComponent)],
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
