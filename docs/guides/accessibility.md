<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Accessibility

- [Introduction](#introduction)
- [Workflow](#workflow)
- [Check the Accessibility of a Page](#check-the-accessibility-of-a-page)
  - [ESLint Rules](#eslint-rules)
  - [Partially Automated Testing](#partially-automated-testing)
    - [Google Lighthouse](#google-lighthouse)
    - [Silktide - Accessibility Checker](#silktide---accessibility-checker)
    - [WAVE - Web Accessibility Evaluation Tool](#wave---web-accessibility-evaluation-tool)
    - [IBM - Equal Access Accessibility Checker](#ibm---equal-access-accessibility-checker)
  - [Manual Testing](#manual-testing)
    - [Keyboard](#keyboard)
    - [Screen Reader](#screen-reader)
- [Further References](#further-references)

## Introduction

The goal of accessibility is to unlock the full potential of the Web and enable people with disabilities to participate on an equal basis.
To achieve this, the [Web Content Accessibility Guidelines (WCAG 2.2.)](https://wcagcom.wpenginepowered.com/resource/what-is-wcag/) provide a set of standards ("[success criteria](https://www.w3.org/WAI/WCAG22/Understanding/)") to ensure that online content is perceivable, operable, understandable, and robust for everyone.
The PWA largely meets this standard.

This guide outlines multiple methods for checking website accessibility and applying the Web Content Accessibility Guidelines (WCAG) 2.2.

## Workflow

The following steps outline a structured method for evaluating accessibility, including following guidelines, using automated tools, and performing manual testing.

**Follow Accessibility Guidelines During Development**

- Use the [Accessibility Easy Check Checklist](accessibility-easy-check.md).
- ESLint Rules: Keep the ESLint accessibility rules enabled in your IDE to ensure compliance during development.

**Use Appropriate Tools**

Scan the page using multiple partially automated accessibility testing tools and address any issues according to the required WCAG 2.2 AA level:

- Do a first check with _Google Lighthouse_
- Use _Silktide_ and _Wave_ to identify any automatically detected issues.

**Test Manually**

- Keyboard navigation: Navigate and operate through the page using only the keyboard.
- Screen reader testing: Use a screen reader like _NVDA_ (or _Silktide's_ simulated screen reader) to verify the accuracy of the HTML markup.

## Check the Accessibility of a Page

### ESLint Rules

The `@angular-eslint` repository contains a set of linting rules that help to enforce accessibility best practices in Angular component templates.

Most of the accessibility rules enabled in the Intershop PWA are part of the `@angular-eslint/template/accessibility` plugin, which is configured in the project's [.eslintrc.json](../../.eslintrc.json) file.
To verify whether your custom code adheres to these rules, run `npm run lint`.
Only a few specific rules that are not included in this plugin are explicitly listed here.

Refer to the official repository to check which rules the plugin currently includes: [ESLint-Plugin Accessibility Rules](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/src/configs/accessibility.json)

> [!WARNING]
> These rules alone are not sufficient to ensure good website accessibility.

Additional rules:

- [@angular-eslint/template/no-positive-tabindex](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/no-positive-tabindex.md): Ensures that the tabindex attribute is not positive.
- [@angular-eslint/template/button-has-type](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/button-has-type.md): Ensures that a button has a valid type specified.

### Partially Automated Testing

While automated tools are useful for identifying **basic** accessibility issues, they can **only partially verify compliance with the WCAG criteria**.
Manual testing is essential to ensure full compliance.
However, they can provide a **quick and easy overview of some accessibility issues** on a page, and a good starting point for where to focus and fix accessibility problems.
The following list contains some suggestions for free tools that have been used to check the accessibility of the PWA:

- _Google Lighthouse_: gives a quick overview and detects general problems
- _Silktide_: huge toolbox, can categorize issues by different WCAG versions
- _WAVE_: visualizes non-visible attributes like aria-labels and -roles or image alt-texts
- _IBM Equal Access Toolkit_: categorizes the issues directly by the WCAG criteria

#### Google Lighthouse

[Google Lighthouse](https://developer.chrome.com/docs/lighthouse) is a tool built directly into the Chrome DevTools that **provides a quick initial overview** of a page's status.
The list of checked criteria can be found [here](https://developer.chrome.com/docs/lighthouse/accessibility/scoring).

#### Silktide - Accessibility Checker

[Silktide](https://chromewebstore.google.com/detail/silktide-accessibility-ch/mpobacholfblmnpnfbiomjkecoojakah) is a Chrome-only extension with many accessibility checking functionalities.

It also includes a simple simulated screen reader, similar to a locally installed one, for quickly checking accessible names of buttons and links.
While limited compared to full screen readers, it is a useful tool for beginners.

#### WAVE - Web Accessibility Evaluation Tool

[WAVE](https://wave.webaim.org) is a browser extension for [Chrome](https://chromewebstore.google.com/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/wave-accessibility-tool), as well as a website for testing deployed websites.

It is a helpful tool for visualizing non-visual accessibility attributes like `aria-labels`, `aria-roles`, and `alt` attributes for images including a detailed description and the related WCAG criteria. _WAVE_ can also visualize the tab order and the HTML page structure (landmarks and headings).

#### IBM - Equal Access Accessibility Checker

[IBM Equal Access Toolkit](https://github.com/IBMa/equal-access) provides browser extensions for [Chrome](https://chromewebstore.google.com/detail/ibm-equal-access-accessib/lkcagbfjnkomcinoddgooolagloogehp) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/accessibility-checker) that integrate into the developer tools.
It categorizes issues directly based on WCAG criteria.

### Manual Testing

#### Keyboard

The purpose of manual testing via keyboard - without using a mouse - is to check the general operability of the page and ensure a logical HTML structure.
Simply avoid using the mouse and navigate/operate the page using the TAB, ENTER, SPACE, or Arrow keys for certain input fields or menus.

#### Screen Reader

For the beginning, Intershop recommends to start with _Silktide’s_ simulated screen reader.
It is less sophisticated and much easier and simpler to use.
A locally installed screen reader can be used to thoroughly test a page for features and properties that the simulated screen reader is not capable of.
It also reflects the real world application of such an assistive technology a lot closer than the simulated one.
A widely used locally installed screen reader is [NVDA](https://www.nvaccess.org/about-nvda/).

If you have no experience with screen readers, the following video about [Accessibility Testing with the NVDA Screen reader](https://www.youtube.com/watch?v=Vx1vSd5uYS8) might be helpful.

## Further References

- [WCAG 2.2 Success Criteria](https://www.w3.org/WAI/WCAG22/Understanding/)
- [Angular A11y ESLint Rules](https://dev.to/bitovi/angular-a11y-eslint-rules-2fjc)
- [Enforcing Accessibility with Angular A11y ESLint Rules](https://www.bitovi.com/blog/angular-a11y-eslint-rules)
- [Angular ESLint Rules for Keyboard Accessibility](https://dev.to/angular/angular-eslint-rules-for-keyboard-accessibility-236f)
- [Angular ESLint Rules for ARIA](https://dev.to/angular/angular-eslint-rules-for-aria-3ba1)
