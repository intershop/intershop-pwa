<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Accessibility

The goal of accessibility is to unlock the full potential of the Web and enable people with disabilities to participate equally.
The `@angular-eslint` repo contains a number of linting rules that can help enforce accessibility best practices in Angular component templates.

The accessibility rules that are enabled in the Intershop PWA are listed/described in this document and configured in the `.eslintrc.json` file of the project.
To check whether the rules are followed in your custom code or not, run `npm run lint`.

## General Rules

```
@angular-eslint/template/accessibility-valid-aria
```

This rule makes sure that all `aria-*` attributes used are valid.
The rule will fail if a non-existent `aria-*` attribute is used, or a valid `aria-*` attribute is given an unexpected value.

## Content Rules

```
@angular-eslint/template/accessibility-alt-text
```

```
@angular-eslint/template/accessibility-elements-content
```

## Interactivity Rules

The navigation is the most important way to find and access the different contents of the website.
For this reason, it is essential that the navigation is accessible.

```
@angular-eslint/template/no-positive-tabindex
```

This rule ensures that `tabindex` is set to `0` (element is tab focusable) or `-1` (element is not tab focusable), and not a positive value that interferes with the automatic tab order of elements.

> **How to fix problems with unreachable elements**
>
> To make HTML elements tab-focusable that are not reachable by default (like `<a>` tags, `<button>`, etc.), `tabindex="0"` can be added to most HTML tags like `<div>` or `<span>`.

```
@angular-eslint/template/click-events-have-key-events
```

This rule ensures, that elements with click event handlers also handle at least one key event (keyup, keydown or keypress).

> **How to fix `click-events-have-key-events` problems**
>
> To fix this, all of the `<a>` tags in the HTML files should have a `routerLink` attribute.
> If adding a meaningful `routerLink` is not possible, `[routerLink]="[]"` should be added to fix the error.
>
> Other HTML elements (`<div>`, `<span>`, etc.) with a `click()` event that report this ESLint error can be fixed by adding a `(keydown.enter)` event that should be assigned with the `click()` event's method.
> In addition a `tabindex="0"` needs to be added to such elements to make them tab focusable.
>
> The outcome is testable when navigating the page in the browser with the tabulator key.
> The clickable areas will be focused and a click event is triggered by pressing the Enter key.

```
@angular-eslint/template/mouse-events-have-key-events
```

Requires any element with a `mouseout` event handler to also handle `blur` events, and any element with a `mouseover` event handler to also handle `focus` events.

## Further References

- [Angular A11y ESLint Rules](https://dev.to/bitovi/angular-a11y-eslint-rules-2fjc)
- [Enforcing Accessibility with Angular A11y ESLint Rules](https://www.bitovi.com/blog/angular-a11y-eslint-rules)
- [Angular ESLint Rules for Keyboard Accessibility](https://dev.to/angular/angular-eslint-rules-for-keyboard-accessibility-236f)
- [Angular ESLint Rules for ARIA](https://dev.to/angular/angular-eslint-rules-for-aria-3ba1)
