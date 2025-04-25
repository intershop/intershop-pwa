import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

import { SuggestBrandsTileComponent } from './suggest-brands-tile.component';

describe('Suggest Brands Tile Component', () => {
  let component: SuggestBrandsTileComponent;
  let fixture: ComponentFixture<SuggestBrandsTileComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestBrandsTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.brands = [
      { brandName: 'Branda', totalCount: 10 },
      { brandName: 'Brandb', totalCount: 20 },
      { brandName: 'Brandc', totalCount: 30 },
    ];
    component.maxAutoSuggests = 2;
    component.inputTerms$ = new ReplaySubject<string>(1);
    component.inputTerms$.next('brand');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the correct number of brand suggestions', () => {
    fixture.detectChanges();
    const brandElements = element.querySelectorAll('ul li');
    expect(brandElements).toHaveLength(2);
  });

  it('should display brand names correctly', () => {
    fixture.detectChanges();
    const brandElements = element.querySelectorAll('ul li a');
    expect(brandElements[0].textContent).toContain('Branda');
    expect(brandElements[1].textContent).toContain('Brandb');
  });
});
