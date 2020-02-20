# Code Documentation

For our Intershop Progressive Web App, Compodoc is used as documentation package. For further information refer to [Compodoc](https://compodoc.app).

For documentation, the _tsconfig.app.json_ file is used as configuration file. The output folder for the documentation is set to _<project-home>/docs/compodoc_.

We use an own styling theme based on the theme '_readthedocs_' provided by Compodoc. The _style.css_ file of the theme can be found in _<project-home>/docs/theme_.

Examples for the comment styling pattern can be found here: [TypeDoc - DocComments](http://typedoc.org/guides/doccomments/).

## Usage

### Generate Code Documentation

**Generate Code Documentation**

```bash
npm run docs
```

The generated documentation can be called by _<project-home>/docs/compodoc/index.html_.

### Serve Generated Documentation with Compodoc

**Serve Generated Documentation with Compodoc**

```bash
npm run docs:serve
```

Documentation is generated at _<project-home>/docs/compodoc_ (output folder). The local HTTP server is launched at _http://localhost:8080_.

**Watch Source Files After Serve and Force Documentation Rebuild**

```bash
npm run docs:watch
```

## Comments

### General Information

The JSDoc comment format is used for general information.

Use this format to describe components, modules, etc., but also methods, inputs, variables and so on.

**Example for General Description**

```typescript
/**
 * The Product Images Component
 */
```

### JSDoc Tags

Currently Compodoc supports the following JSDoc tags :

- `@returns`
- `@param`
- `@link`
- `@example`

**Example for parameter and return values**

```typescript
/**
 * REST API - Get full product data
 * @param productSku  The product SKU for the product of interest.
 * @returns           Product information.
 */
getProduct(productSku: string): Observable<Product> {
 ...
}
```

**Example for links and implementation examples**

```typescript
/**
 * The Product Images Component displays carousel slides for all images of the product and a thumbnails list as carousel indicator.
 * It uses the {@link ProductImageComponent} for the rendering of product images.
 *
 * @example
 * <ish-product-images [product]="product"></ish-product-images>
 */
```

> ![Note](icons/note.png) **Indentation Warning**  
> TypeScript has an internal margin for new lines. If you want to keep a level of indentation, put a minimum of 13 space characters as shown in the example:

**Example with Indentation Keeping**

```typescript
/**
 * @example
 * <div class="form-group has-feedback" [formGroup]="form" [ishShowFormFeedback]="formControl">
 *               <input
 *                 [type]="type"
 *                 class="form-control">
 *               <ish-form-control-feedback [messages]="errorMessages" [control]="formControl"></ish-form-control-feedback>
 * </div>
 */
```

> New lines are created inside a comment with a blank line between two lines:

**Comments with New Lines**

```typescript
/**
 * First line
 *
 * Second line
 */

/**
 * First line
 * Behind first line, produces only one line
 */
```

## Documentation Rules

### General Documentation Rules

- Use speaking names, especially for methods, effects and actions.
- We do not need additional documentation if the name describes the behavior.
- Use comments for documentation in all cases where the name alone cannot describe everything .

### Component Documentation

To document a component of the Intershop Progressive Web App:

- A description of the general behavior of the component exists.
- All input parameters are described.
- All output parameters are described.
- An example of how the component can be used in templates is shown.
- Relevant components used by the component could be linked in the documentation.

**Example for the Documentation of a Component**

```typescript
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

/**
 * The Product Images Component displays carousel slides for all images of the product and a thumbnails list as carousel indicator.
 * It uses the {@link ProductImageComponent} for the rendering of product images.
 *
 * @example
 * <ish-product-images [product]="product"></ish-product-images>
 */
@Component({
  selector: 'ish-product-images',
  templateUrl: './product-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImagesComponent {
  /**
   * The product for which the images should be displayed.
   */
  @Input() product: Product;

  activeSlide = 0;

  getImageViewIDsExcludePrimary = ProductHelper.getImageViewIDsExcludePrimary;

  /**
   * Set the active slide via index (used by the thumbnail indicator).
   * @param slideIndex  The slide index number to set the active slide.
   */
  setActiveSlide(slideIndex: number) {
    this.activeSlide = slideIndex;
  }

  /**
   * Check if the given slide index equals the active slide.
   * @param slideIndex  The slide index number to be checked if it is the active slide.
   * @returns           True if the given slide index is the active slide, false otherwise.
   */
  isActiveSlide(slideIndex: number): boolean {
    return this.activeSlide === slideIndex;
  }
}
```

### Service Documentation

To document a service of the Intershop Progressive Web App:

- A description of the service exists.
- The methods of the service with the input and output parameters are described.

**Example for the Documentation of a Service**

```typescript
import { ApiService } from '../../../core/services/api.service';
import { Product } from '../../../models/product/product.model';
...

/**
 * The Products Service handles the interaction with the 'products' REST API.
 */
@Injectable()
export class ProductsService {

  /**
   * The REST API URI endpoints.
   */
  productsServiceIdentifier = 'products/';
  categoriesServiceIdentifier = 'categories/';

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * Get the full Product data for the given Product SKU.
   * @param sku  The Product SKU for the product of interest.
   * @returns    The Product data.
   */
  getProduct(sku: string): Observable<Product> {
    if (!sku) {
      return ErrorObservable.create('getProduct() called without a sku');
    }
    const params: HttpParams = new HttpParams().set('allImages', 'true');
    return this.apiService.get<ProductData>(this.productsServiceIdentifier + sku, params, null, false, false).pipe(
      map(productData => ProductMapper.fromData(productData))
    );
  }

}
```

### Directive Documentation

To document a directive of the Intershop Progressive Web App:

- A description of the general behavior of the directive exists.
- All input properties are described.
- An example how the directive can be used in templates is shown.

**Example for the Documentation of a Directive**

```typescript
import { Directive, HostBinding, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * An attribute directive that adds CSS classes to a dirty host element related to the validity of a FormControl.
 *
 * @example
 * <div class="form-group has-feedback" [formGroup]="form" [ishShowFormFeedback]="formControl">
 *               <input
 *                 [type]="type"
 *                 class="form-control"
 *                 [formControlName]="controlName">
 * </div>
 */
@Directive({
  selector: '[ishShowFormFeedback]',
})
export class ShowFormFeedbackDirective {
  /**
   * FormControl which validation status is considered.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('ishShowFormFeedback') control: AbstractControl;

  /**
   * If form control is invalid and dirty 'has-error' class is added.
   */
  @HostBinding('class.has-error') get hasErrors() {
    return this.control.invalid && this.control.dirty;
  }

  /**
   * If form control is valid and dirty 'has-success' class is added.
   */
  @HostBinding('class.has-success') get hasSuccess() {
    return this.control.valid && this.control.dirty;
  }
}
```

### Model Documentation

For models/interfaces only the helper methods need a documentation (only in the case that the method name is not self explanatory) .

### Guard/Resolver/Interceptor Documentation

For guards, resolvers and interceptors the class should be described. The methods need no additional description.

**Example for the Documentation of an Interceptor**

```typescript
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

let TOKEN: string;

const tokenHeaderKeyName = 'authentication-token';
const authorizationHeaderKey = 'Authorization';

/**
 * Intercepts outgoing HTTP request and sets authentication-token if available.
 * Intercepts incoming HTTP response and updates authentication-token.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (TOKEN && !req.headers.has(authorizationHeaderKey)) {
      req = req.clone({ headers: req.headers.set(tokenHeaderKeyName, TOKEN) });
    }

    return next.handle(req).pipe(tap(this.setTokenFromResponse));
  }

  private setTokenFromResponse(event: HttpEvent<any>) {
    if (event instanceof HttpResponse) {
      const response = <HttpResponse<any>>event;
      const tokenReturned = response.headers.get(tokenHeaderKeyName);
      if (tokenReturned) {
        TOKEN = tokenReturned;
      }
    }
  }
}

export function _setToken(token: string): void {
  TOKEN = token;
}
```

### Configuration/Injection Key Documentation

To document configuration or injection keys of the Intershop Progressive Web App, the stored information of the keys has to be described.

If there are several states possible, describe the states of the key.

**Example for the Documentation of a Configuration Key**

```typescript
import { InjectionToken } from '@angular/core';

/**
 * global definition of the endless scrolling page size.
 */
export const ENDLESS_SCROLLING_ITEMS_PER_PAGE = new InjectionToken<boolean>('endlessScrollingItemsPerPage');
```
