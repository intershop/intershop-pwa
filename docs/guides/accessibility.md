<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Accessibility

- [Accessibility](#accessibility)
  - [General](#general)
    - [Attributes and Roles](#attributes-and-roles)
    - [Titles instead of ARIA-Attributes](#titles-instead-of-aria-attributes)
    - [Usage of native HTML-Elements](#usage-of-native-html-elements)
  - [Check the Accessibility of a Page](#check-the-accessibility-of-a-page)
    - [Tools](#tools)
      - [Google Lighthouse](#google-lighthouse)
      - [Silktide - Accessibility Checker](#silktide---accessibility-checker)
      - [WAVE - Web Accessibility Evaluation Tool](#wave---web-accessibility-evaluation-tool)
      - [IBM - Equal Access Accessibility Checker](#ibm---equal-access-accessibility-checker)
    - [Manual Testing](#manual-testing)
      - [Keyboard](#keyboard)
      - [Screen Reader](#screen-reader)
    - [Example Workflow](#example-workflow)
  - [ESLint Rules](#eslint-rules)
    - [Accessibility Plugin](#accessibility-plugin)
    - [Additional Rules](#additional-rules)
  - [Project specific Applications](#project-specific-applications)
    - [How to fix `click-events-have-key-events` problems](#how-to-fix-click-events-have-key-events-problems)
    - [Form Submission using the key "Enter"](#form-submission-using-the-key-enter)
    - [Form submission in dialogs](#form-submission-in-dialogs)
  - [Further References](#further-references)

The goal of accessibility is to unlock the full potential of the Web and enable people with disabilities to participate equally.
The `@angular-eslint` repo contains a number of linting rules that can help enforce accessibility best practices in Angular component templates.

Most of the accessibility rules that are enabled in the Intershop PWA are contained in the plugin `@angular-eslint/template/accessibility` that is configured in the `.eslintrc.json` file of the project.
To check whether the rules are followed in your custom code or not, run `npm run lint`.

## General

### Attributes and Roles

Generally it is checked if valid `aria-*` and `role=*` attributes are used and that every necessary element is reachable with the keyboard, and that an action (like pressing enter) can be performed on them.

### Titles instead of ARIA-Attributes

If an element has to be made more descriptive by adding a title-attribute or an aria-label, we decided to use the title and not the label, because a title provides visual feedback and can also be read as a label by screen-readers.

:x: **Wrong HTML structure, title and aria-label would be read by a screen-reader**

```html
<button [title]="Close" [aria-label]="close">
  <span>x</span>
</button>
```

:warning: **Only use when no title is needed**

```html
<button [aria-label]="close">
  <span>x</span>
</button>
```

:heavy_check_mark: **Preferred HTML structure**

```html
<button [title]="Close">
  <span>x</span>
</button>
```

### Usage of native HTML-Elements

It is generally advised to use native HTML-elements instead of giving roles to container-elements like a `<div>`, because native elements already bring most accessibility functionalities with them, like tab-focus and confirm by pressing enter.
If, for example, instead of a `<button>` a `<div role="button">` is used, the functionality of pressing enter to activate the button has to be manually implemented via code.

:warning: **Don't assign roles to HTML-elements that exist natively**

```html
<div role="button">
  <span>x</span>
</div>
```

:heavy_check_mark: **Use native HTML-elements if they exist**

```html
<button [title]="Close">
  <span>x</span>
</button>
```

## Check the Accessibility of a Page

### Tools

With the current technology, automated tools can only check for around 25-30% of the WCAG criteria.
They can however provide a **quick and easy overview over some accessibility issues** on a page and give a good starting point on where to focus and fix accessibility problems.
The following list are some suggestions of free tools that have been used to check the accessibility of the PWA:

- <u>**Google Lighthouse**</u>: quick overview and good for detecting general problems
- <u>**Silktide**</u>: huge toolbox, can categorize issues after different WCAG versions
- <u>WAVE</u>: good for checking non-visible attributes like aria-labels and -roles or image alt-texts
- <u>IBM</u>: categorizes the issues directly after the WCAG criteria, but throws many false positives

#### Google Lighthouse

Google Lighthouse is a tool directly build into the dev-tools of the Google Chrome browser and is great to **get a first quick overview** over the page status.

It is accessible by pressing "`F12`" and selecting the "_Lighthouse_" tab.
If you only want to check for accessibility issues, only tick the "_Accessibility_" checkbox under "_Categories_".

The most informative and visual "_Mode_" is the default mode "_Navigation_".
That option reloads the page.
If a page needs to be tested which has elements that don’t stay after a reload, select the "_Snapshot_" option instead.

> [!NOTE]
> It’s important to note that the browser window with the tested page should be focused after clicking "Analyze page load" or else it might throw an error, saying that it couldn’t analyze the page because it didn’t render any content.

The <u>list of checked criteria</u> can be found [here](https://developer.chrome.com/docs/lighthouse/accessibility/scoring).

#### Silktide - Accessibility Checker

Silktide is a Chrome-only extension with **many different functionalities** for accessibility that combines a lot of features of other tools.

It also **includes a simulated screen reader** that is **very easy to use**.
The screen reader works almost exactly like a locally installed one and is a good and easy way to check for accessible names of buttons and links.
It does have limitations compared to an installed screen reader, but it is a good tool for people who are not familiar with screen readers and just want to quickly check some elements.

Comparing it to the other tools, it doesn’t seem to detect as many accessibility issues.
It can however test against different WCAG versions and conformance levels.

<u>Browser Plugin</u>:

- [Chrome](https://chromewebstore.google.com/detail/silktide-accessibility-ch/mpobacholfblmnpnfbiomjkecoojakah)

#### WAVE - Web Accessibility Evaluation Tool

WAVE is a browser extension and website.
The extension can be toggled by clicking the extension-icon in the browser.

It is a very helpful tool to **visualize non-visual accessibility attributes** like `aria-labels` and `-roles` or `alt`-texts for images.
Clicking on the :information_source:-icon behind a problem displays a more detailed description, as well as the related WCAG criteria.

It can also visualize the **tab-order** and the **HTML site structure** (landmarks and headings).

> [!NOTE]
> The tool isn’t that technically advanced and seems a bit rudimentary. One big downside is that it displaces elements on the page to render its own content, which leads to a cluttered page, obscured elements and false alerts regarding contrast issues.

<u>Browser Plugin</u>:

- [Chrome](https://chromewebstore.google.com/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/wave-accessibility-tool)

<u>Website</u> for deployed websites: https://wave.webaim.org

#### IBM - Equal Access Accessibility Checker

IBM is a browser extension that after installing it can be found in the dev-tools (opened by pressing "`F12`") of the browser like Google Lighthouse.

This tool is helpful because it **categorizes the issues directly after the WCAG criteria**.
By default, they’re sorted after "_Element roles_", that should be changed to "_Requirements_" via the dropdown.

> [!NOTE]
> The detection feels a bit too strict, so the results have to be manually filtered
>
> - a lot of things are marked as "_Needs review_" that often aren’t a violation
> - and bootstrap elements or angular components are marked as violations, that may have a function when being activated but don’t present a real issue on the website

<u>Browser Plugin</u>:

- [Chrome](https://chromewebstore.google.com/detail/ibm-equal-access-accessib/lkcagbfjnkomcinoddgooolagloogehp)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/accessibility-checker)

### Manual Testing

#### Keyboard

The point of manual testing via keyboard is to check for the **general operability of the page** and a logical HTML structure.

Simply don’t use the mouse, and only navigate/operate the page with the tab- and enter/space-keys (or arrow-keys for certain input fields).

Things to look out for:

- Does the **tab-focus** go through the page in a **logical order**?
- Can the **tab-focus** go through the entire page without being "**trapped**" somewhere?
- Is the **tab-focus visible** on every element it can reach?
- Is every interactive **element reachable** with just the keyboard?
- Is every interactive **element operable** with just the keyboard?
- Do elements that receive the tab-focus only **execute a functionality** if it is specifically activated with the enter/space-key?

#### Screen Reader

### Example Workflow

## ESLint Rules

ESLint provides a plugin that includes most of the necessary accessibility-rules.
Only some individual rules that do not come with this plugin are specifically written down here.

### Accessibility Plugin

```
plugin:@angular-eslint/template/accessibility
```

For reference on which rules the plugin currently includes, please check the official repository:

- [ESLint-Plugin Accessibility Rules](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/src/configs/accessibility.json)

### Additional Rules

```
@angular-eslint/template/no-positive-tabindex
```

If an unreachable element has to be made reachable by providing a `tabindex`, the index should never be a positive number, only `0` (element is tab focusable) or `-1` (element is not tab focusable).
The tab-order has to be determined by the HTML-structure, not by the index.

## Project specific Applications

### How to fix `click-events-have-key-events` problems

To address this issue, make sure that every `<a>` tag in the HTML files includes a `routerLink` attribute.
If a link is only intended to trigger an action and not used to navigate the user to another page, it is recommended to use `<button>` tags instead of anchor tags, because buttons inherently provide better support for keyboard interactions and enhance overall accessibility.
To make the buttons look like links use the css classes `btn btn-link btn-link-action` for text links and `btn-tool btn-link` for icon links.
In case you have to use anchor tags nevertheless e.g. because of styling issues make sure you define a keypress.enter action and the tabindex="0" attribute for the anchor tag.

Other HTML elements (`<div>`, `<span>`, etc.) with a `click()` event that report this ESLint error can be fixed by adding a `(keydown.enter)` event that should be assigned with the `click()` event's method.
In addition, a `tabindex="0"` needs to be added to such elements to make them tab focusable.

### Form Submission using the key "Enter"

Implicit form submission using the "Enter" key is vital to assistive technologies, see also [HTML5 specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission).
Therefore, the `form` tag has to include an `input` of `type="submit"`, for example

```html
<form>
  <label for="foo">Name:</label>
  <input type="text" name="foo" id="foo" />
  <input type="submit" value="Submit" />
</form>
```

or a button of type "submit"

```html
<form>
  <label for="foo">Name:</label>
  <input type="text" name="foo" id="foo" />
  <button type="submit">Submit</button>
</form>
```

### Form submission in dialogs

Dialogs (or modals) are separated into three sections:

- modal header
- modal body
- modal footer

where the form is positioned inside the model body and the buttons are positioned inside the modal footer.
The following simplified example shows the wrong HTML structure:

:warning: **Wrong HTML structure**

```html
<div class="modal-body">
  <form (ngSubmit)="submit()">
    <formly-form></formly-form>
  </form>
</div>
<div class="modal-footer">
  <button type="button" (click)="submit()">Submit</button>
  <button type="button" (click)="cancel()">Cancel</button>
</div>
```

The button with the text "Submit" calls the same function `foo()` as the form `(ngSubmit)` but the form would not be submitted using the "Enter" key because the submit button is positioned outside the `form` tag.
The following example shows the correct HTML structure:

:heavy_check_mark: **Correct HTML structure**

```html
<form (ngSubmit)="submit()">
  <div class="modal-body">
    <formly-form></formly-form>
  </div>
  <div class="modal-footer">
    <button type="submit">Submit</button>
    <button type="button" (click)="cancel()">Cancel</button>
  </div>
</form>
```

where

- the `form` tag surrounds both the formly form (including the form elements) and the submit button
- the function `submit()` is only called at the `form` tag
- the "Submit" button is correctly defined using `type="submit"` and does not call `submit()` using `(click)=""`
- the "Cancel" button is only defined as `type="button"` to prevent any default behavior

## Further References

- [Angular A11y ESLint Rules](https://dev.to/bitovi/angular-a11y-eslint-rules-2fjc)
- [Enforcing Accessibility with Angular A11y ESLint Rules](https://www.bitovi.com/blog/angular-a11y-eslint-rules)
- [Angular ESLint Rules for Keyboard Accessibility](https://dev.to/angular/angular-eslint-rules-for-keyboard-accessibility-236f)
- [Angular ESLint Rules for ARIA](https://dev.to/angular/angular-eslint-rules-for-aria-3ba1)
