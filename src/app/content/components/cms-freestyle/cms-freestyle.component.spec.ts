import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PipesModule } from '../../../shared/pipes.module';

import { CMSFreestyleComponent } from './cms-freestyle.component';

describe('Cms Freestyle Component', () => {
  let component: CMSFreestyleComponent;
  let fixture: ComponentFixture<CMSFreestyleComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CMSFreestyleComponent],
      imports: [PipesModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSFreestyleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });

  it('should render content if available', () => {
    component.pagelet = {
      definitionQualifiedName: 'fq',
      displayName: 'name',
      id: 'id',
      configurationParameters: { HTML: '<h3>foo</h3>bar' },
    };
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
