import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { spy, verify } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';

import { ProductAddToCompareComponent } from './product-add-to-compare.component';

describe('Product Add To Compare Component', () => {
  let component: ProductAddToCompareComponent;
  let fixture: ComponentFixture<ProductAddToCompareComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        IconModule,
        PipesModule,
        RouterTestingModule,
        StoreModule.forRoot(
          {
            configuration: configurationReducer,
          },
          { initialState: { configuration: { features: ['compare'] } } }
        ),
        TranslateModule.forRoot(),
      ],
      declarations: [ProductAddToCompareComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToCompareComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show disable button when "isInCompareList" is set to "true" ', () => {
    component.isInCompareList = true;
    fixture.detectChanges();
    expect(element.querySelector('button').className).toContain('is-selected');
  });

  it('should show disable button when "isInCompareList" is set to "false" ', () => {
    component.isInCompareList = false;
    fixture.detectChanges();
    expect(element.querySelector('button').className).toBe('btn btn-link add-to-compare');
  });

  it('should detect errors on emitter using spy', () => {
    const emitter = spy(component.compareToggle);
    component.toggleCompare();

    verify(emitter.emit()).once();
  });
});
