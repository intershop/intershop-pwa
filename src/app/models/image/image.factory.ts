import { FactoryHelper } from '../factory-helper';
import { ImageData } from './image.interface';
import { Image } from './image.model';

export class ImageFactory {

  static fromData(data: ImageData): Image {
    const attribute: Image = new Image();
    FactoryHelper.primitiveMapping<ImageData, Image>(data, attribute);
    return attribute;
  }
}
