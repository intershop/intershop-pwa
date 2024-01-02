import { DotCmsImage } from './dot-cms-image.model';

export class DotCmsImageHelper {
  static equal(dotCmsImage1: DotCmsImage, dotCmsImage2: DotCmsImage): boolean {
    return !!dotCmsImage1 && !!dotCmsImage2 && dotCmsImage1.id === dotCmsImage2.id;
  }
}
