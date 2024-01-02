import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DotCmsImage } from 'ish-core/models/dot-cms-image/dot-cms-image.model';
import { DotCmsImageService } from 'ish-core/services/dot-cms-image/dot-cms-image.service';

@Component({
  selector: 'ish-dot-cms-image',
  templateUrl: './dot-cms-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line rxjs-angular/prefer-takeuntil
export class DotCmsImageComponent {
  images$: Observable<DotCmsImage[]>;

  dotCmsEnv = 'https://local.dotcms.site:8443';
  constructor(private imageService: DotCmsImageService) {}

  ngOnInit(): void {
    this.images$ = this.imageService.getDotCmsImage();
  }
}
