import { Product } from './product.model';

describe('Product', () => {
  let product: Product;
  beforeEach(() => {
    product = new Product('sku');
    product.images = [
      {
        'name': 'front S',
        'type': 'Image',
        'imageActualHeight': 110,
        'imageActualWidth': 110,
        'viewID': 'front',
        'effectiveUrl': '/assets/product_img/a.jpg',
        'typeID': 'S',
        'primaryImage': true
      },
      {
        'name': 'front S',
        'type': 'Image',
        'imageActualHeight': 110,
        'imageActualWidth': 110,
        'viewID': 'front',
        'effectiveUrl': '/assets/product_img/a.jpg',
        'typeID': 'S',
        'primaryImage': false
      },
      {
        'name': 'front L',
        'type': 'Image',
        'imageActualHeight': 500,
        'imageActualWidth': 500,
        'viewID': 'front',
        'effectiveUrl': '/assets/product_img/a.jpg',
        'typeID': 'L',
        'primaryImage': true
      },
      {
        'name': 'side L',
        'type': 'Image',
        'imageActualHeight': 500,
        'imageActualWidth': 500,
        'viewID': 'side',
        'effectiveUrl': '/assets/product_img/b.jpg',
        'typeID': 'L',
        'primaryImage': false
      }

    ];
  });

  describe('getPrimaryImage()', () => {

    it('should return primary image when called with image type as L(Large size)', () => {
      expect(product.getPrimaryImage('L').primaryImage).toBeTruthy();
    });

    it('should return no image when called with invalid image type', () => {
      expect(product.getPrimaryImage('W')).toBeUndefined();
    });
  });


  describe('getImageViewIDsExcludePrimary()', () => {

    it('should return list of image viewIDs  excluding primary image viewID when called with image type as L(Large size)', () => {
      expect(product.getImageViewIDsExcludePrimary('L').length).toBeGreaterThan(0);
    });

    it('should return empty list when called with invalid image type', () => {
      expect(product.getImageViewIDsExcludePrimary('W').length).toEqual(0);
    });
  });

  describe('getImageByImageTypeAndImageView()', () => {

    it('should return image when called with image type as L(Large size) and image view as front', () => {
      expect(product.getImageByImageTypeAndImageView('L', 'front')).toEqual(product.images[2]);
    });

    it('should return no image when called with invalid image type and invalid image view', () => {
      expect(product.getImageByImageTypeAndImageView('W', 'left')).toBeUndefined();
    });
  });

});
