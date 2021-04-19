<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Code Documentation

For our Intershop Progressive Web App, [Compodoc](https://compodoc.app) is used as documentation package.

For documentation, the _tsconfig.doc.json_ file is used as configuration file.
The output folder for the documentation is set to _<project-home>/docs/compodoc_.

We use an own styling theme based on the theme '_readthedocs_' provided by Compodoc.
The _style.css_ file of the theme can be found in _<project-home>/docs/theme_.

Examples for the comment styling pattern can be found here: [TypeDoc - DocComments](http://typedoc.org/guides/doccomments/).

## Usage

### Generate Code Documentation

**Generate Code Documentation**

```bash
npm run compodoc
```

The generated documentation can be called by _<project-home>/docs/compodoc/index.html_.

### Serve Generated Documentation with Compodoc

**Serve Generated Documentation with Compodoc**

```bash
npm run compodoc:serve
```

Documentation is generated at _<project-home>/docs/compodoc_ (output folder).
The local HTTP server is launched at _http://localhost:8080_.

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
 * Get products for a given search term respecting pagination.
 * @param searchTerm    The search term to look for matching products.
 * @param page          The page to request (1-based numbering)
 * @param sortKey       The sortKey to sort the list, default value is ''.
 * @returns             A list of matching Product stubs with a list of possible sortings and the total amount of results.
 */
searchProducts(
  searchTerm: string,
  page: number,
  sortKey?: string
): Observable<{ products: Product[]; sortKeys: string[]; total: number }> {
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

> :warning: **Indentation Warning**  
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

## :warning: Document only if documentation is needed!

This is not a project with obligatory documentation, so: Do not document the obvious! For example, if behavior and requirements can be implied by a method signature, no additional documentation is needed.
Instead **pay attention to useful names**.
If you cannot find a pricise name for your variable or method, maybe this is a sign that too much is done here and it would be better to **refactor instead**.

However, there are some cases where documentation is recommended:

- Technical background required,

- Restraints on method arguments, that cannot be inferred by the method signature alone,

- Tricky parts where some degree of magic is happening (especially useful as in-line documentation),

- Class documentation for exported shared components.
