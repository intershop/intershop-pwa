import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { ProductAddToCompareComponent } from './product-add-to-compare.component';

describe('Product Add To Compare Component', () => {
  let component: ProductAddToCompareComponent;
  let fixture: ComponentFixture<ProductAddToCompareComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('compare'), TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), ProductAddToCompareComponent],
    }).compileComponents();
  });

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

  it('should show muted button when "isInCompareList" is set to "true" ', () => {
    component.isInCompareList = true;
    fixture.detectChanges();
    expect(element.querySelector('button').className).toContain('is-selected');
  });

  it('should show normal button when "isInCompareList" is set to "false" ', () => {
    component.isInCompareList = false;
    fixture.detectChanges();
    expect(element.querySelector('button').className).toBe('btn add-to-compare');
  });

  it('should not show an icon when display type is not icon ', () => {
    fixture.detectChanges();
    expect(element.querySelector('fa-icon')).toBeFalsy();
  });

  it('should show icon button when display type is icon ', () => {
    component.displayType = 'icon';
    fixture.detectChanges();
    expect(element.querySelector('fa-icon')).toBeTruthy();
  });

  it('should detect errors on emitter using spy', () => {
    const emitter = spy(component.compareToggle);
    component.toggleCompare();

    verify(emitter.emit()).once();
  });
});
