import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { createSimplePageletView } from 'ish-core/models/content-view/content-views';
import { PipesModule } from 'ish-core/pipes.module';

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
      definitionQualifiedName: 'fq',
      configurationParameters: { HTMLText: 'foo' },
    };
    component.pagelet = createSimplePageletView(pagelet);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
