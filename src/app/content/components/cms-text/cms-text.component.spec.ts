import { ComponentFixture, TestBed, async } from '@angular/core/testing';

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
    component.pagelet = {
      id: 'id',
      displayName: 'name',
      definitionQualifiedName: 'fq',
      configurationParameters: { HTMLText: 'foo' },
    };
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
