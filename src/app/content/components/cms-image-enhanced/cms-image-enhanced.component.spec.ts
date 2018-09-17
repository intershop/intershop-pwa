import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { STATIC_URL } from '../../../core/services/state-transfer/factories';
import { createImagePageletView } from '../../../models/content-view/content-image-view';
import { createSimplePageletView } from '../../../models/content-view/content-views';
import { PipesModule } from '../../../shared/pipes.module';

import { CMSImageEnhancedComponent } from './cms-image-enhanced.component';

describe('Cms Image Enhanced Component', () => {
  let component: CMSImageEnhancedComponent;
  let fixture: ComponentFixture<CMSImageEnhancedComponent>;
  let element: HTMLElement;
  const BASE_URL = 'http://www.example.org';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CMSImageEnhancedComponent],
      imports: [RouterTestingModule, PipesModule],
      providers: [{ provide: STATIC_URL, useValue: BASE_URL }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSImageEnhancedComponent);
    component = fixture.componentInstance;
    const pagelet = {
      definitionQualifiedName: 'fq',
      displayName: 'name',
      id: 'id',
      configurationParameters: {
        Image: 'foo:bar.png',
      },
      slots: [],
    };
    component.pagelet = createImagePageletView(createSimplePageletView(pagelet));
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
