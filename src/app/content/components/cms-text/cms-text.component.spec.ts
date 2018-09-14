import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { createSimplePageletView } from '../../../models/content-view/content-views';
import { PipesModule } from '../../../shared/pipes.module';

import { CMSTextComponent } from './cms-text.component';

describe('Cms Text Component', () => {
  let component: CMSTextComponent;
  let fixture: ComponentFixture<CMSTextComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CMSTextComponent],
      imports: [PipesModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSTextComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });

  it('should render html text pagelet if set', () => {
    const pagelet = {
      id: 'id',
      displayName: 'name',
      definitionQualifiedName: 'fq',
      configurationParameters: { HTMLText: 'foo' },
      slots: [],
    };
    component.pagelet = createSimplePageletView(pagelet);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
