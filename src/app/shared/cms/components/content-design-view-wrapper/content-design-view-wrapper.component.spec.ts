import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { PreviewService } from 'ish-core/utils/preview/preview.service';

import { ContentDesignViewWrapperComponent } from './content-design-view-wrapper.component';

describe('Content Design View Wrapper Component', () => {
  let component: ContentDesignViewWrapperComponent;
  let fixture: ComponentFixture<ContentDesignViewWrapperComponent>;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;
  let previewService: PreviewService;

  beforeEach(async () => {
    cmsFacade = mock(CMSFacade);
    previewService = mock(PreviewService);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ContentDesignViewWrapperComponent, MockComponent(FaIconComponent)],
      providers: [
        { provide: CMSFacade, useFactory: () => instance(cmsFacade) },
        { provide: PreviewService, useFactory: () => instance(previewService) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentDesignViewWrapperComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
