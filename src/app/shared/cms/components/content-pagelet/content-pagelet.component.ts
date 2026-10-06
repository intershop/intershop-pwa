import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { CMSComponentProvider, CMS_COMPONENT } from 'ish-shared/cms/configurations/injection-keys';

/**
 * The Content Pagelet Component renders the pagelet for the given 'pageletId'.
 * For the rendering an Angular component is used that has to be provided
 * for the DefinitionQualifiedName of the pagelet.
 *
 * @example
 * <ish-content-pagelet [pageletId]="pagelet" />
 */
@Component({
  selector: 'ish-content-pagelet',
  standalone: false,
  templateUrl: './content-pagelet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageletComponent implements OnChanges, OnInit {
  /**
   * The Id of the Pagelet that is to be rendered.
   */
  @Input() pageletId: string;

  @ViewChild('cmsOutlet', { read: ViewContainerRef, static: true }) cmsOutlet: ViewContainerRef;

  private pageletId$ = new ReplaySubject<string>(1);
  private destroyRef = inject(DestroyRef);

  constructor(
    private injector: Injector,
    private cmsFacade: CMSFacade,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.pageletId$
      .pipe(
        switchMap(pageletId => this.cmsFacade.pagelet$(pageletId)),
        whenTruthy(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(pagelet => {
        this.mapComponent(pagelet);
        this.cdRef.markForCheck();
      });
  }

  ngOnChanges() {
    this.pageletId$.next(this.pageletId);
  }

  private mapComponent(pagelet: ContentPageletView) {
    const components = this.injector.get<CMSComponentProvider[]>(CMS_COMPONENT, []);
    const mappedComponent = components.find(c => c.definitionQualifiedName === pagelet.definitionQualifiedName);

    if (mappedComponent) {
      this.createComponent(mappedComponent).setInput('pagelet', pagelet);
    } else {
      console.warn(`did not find mapping for ${pagelet.id} (${pagelet.definitionQualifiedName})`);
    }
  }

  private createComponent(mappedComponent: CMSComponentProvider) {
    this.cmsOutlet.clear();
    return this.cmsOutlet.createComponent(mappedComponent.class);
  }
}
