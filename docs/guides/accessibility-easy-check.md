<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Accessibility Easy Check

- [Accessibility Easy Check](#accessibility-easy-check)
  - [Introduction](#introduction)
  - [Development Accessibility Checklist](#development-accessibility-checklist)
    - [Common](#common)
    - [Keyboard](#keyboard)
    - [Visual Requirements](#visual-requirements)
    - [Proper Semantics](#proper-semantics)
    - [Images](#images)
    - [Forms](#forms)
  - [Project Accessibility Checklist](#project-accessibility-checklist)

## Introduction

The accessibility checklist is designed to assist developers, visual and interaction designers, requirements engineers and projects in preventing and identifying accessibility issues.
These checks address only a few accessibility concerns and are intended to be quick and simple rather than thorough.
A web page or component may appear to meet these criteria while still containing significant accessibility barriers.
A more in-depth evaluation is necessary for a comprehensive accessibility assessment.

The checklist covers essential aspects of web accessibility and should be used:

- when creating interaction and visual design: Ensure designs meet accessibility standards from the outset and maintain consistent interactions to avoid confusion.

- during development and code reviews: Verify that code complies with accessibility best practices and standards.

- when analyzing existing shops or agency deliverables: Evaluate the accessibility of existing pages or submissions.

If you need more general information about accessibility in the PWA, see [Accessibility](accessibility.md).

## Development Accessibility Checklist

Performing any of the following checks on a web page will provide you with a basic understanding of its accessibility.

### Common

- [ ] **1. [Zoom](https://www.w3.org/WAI/test-evaluate/easy-checks/zoom/)**

  Some people need to enlarge content in order to read it.
  When content is zoomed using the browser's zoom functionality it still needs to be legible and usable:

  - All text is enlarged
  - Text does not disappear or become truncated.
  - There is no overlap.
  - All buttons and form elements are visible and usable.

- [ ] **2. [Page Title](https://www.w3.org/WAI/test-evaluate/easy-checks/title/)**

  Page titles are the first thing read by screen readers and help people know where they are.
  They describe the content of a website concisely and appropriately and are composed of the individual title of a page, e.g., "About Us" or "News," and a general description of the website, e.g., the company name.
  They can be set in the [Angular Routing Modules](https://v16.angular.io/guide/router#setting-the-page-title)

- [ ] **3. [Headings](https://www.w3.org/WAI/test-evaluate/easy-checks/headings/)**

  Headings communicate the organization of the content on the page.
  Screen reader users often use page headings as a way to navigate a web page.

  - All pages should at least have a `<h1>` level heading giving the title of the page.
  - Levels should not be skipped as sub-headings are created, like the table-of-contents in a book.
  - Do not select heading levels based on their appearance, use CSS classes for the correct styling.

- [ ] **4. [Correct Messaging and Feedback](https://www.w3.org/WAI/perspective-videos/notifications/)**

  Users need to know what is going on, and get appropriate feedback during interaction.

  - Use the correct types of messaging (success, error, alert, info, hints, status, instructions) where messages and additional information should be clearly visible, specific, related to the current context and provide actionable or additional information.
  - Ensure that dynamically added messages are and announced to screen readers.
  - Ensure that focus management is handled properly if the update requires immediate attention where all notifications which require user action should be dismissible via keyboard. Ensure that toast messages remain visible long enough to be read by all users.

### Keyboard

- [ ] **5. [Full Keyboard Support](https://webaim.org/techniques/keyboard/)**

  Many users with motor disabilities rely on a keyboard.
  Ensure that all interactive elements and controls are keyboard accessible and the user can navigate the entire page without being "trapped".

  - You may need to use tabindex="0" to ensure an element can receive keyboard focus.
  - All click events must also have key events.
  - Verify that hover and important interactions and element toggles are accessible via both keyboard and touch not to make interactions solely dependent on hover.
  - Ensure modals are properly accessible, focus is managed and that they can be easily closed.

- [ ] **6. Tab Navigation Order**

  The keyboard navigation order must be logical and intuitive, with focus moving consistently through the page.
  This generally means that it follows the visual flow of the page-left to right, top to bottom.
  For best results:

  - Structure your underlying source code so that the reading/navigation order is correct.
  - If necessary, use CSS to control the visual presentation of the elements on your page.

- [ ] **7. [Visible Keyboard Focus](https://www.w3.org/WAI/test-evaluate/easy-checks/keyboard-focus/)**

  For keyboard users, it's crucial to always know which element (e.g., link or form control) has focus.
  The focus indicator must be clearly visible on every interactive element.

### Visual Requirements

- [ ] **8. [Color Contrast](https://www.w3.org/WAI/test-evaluate/easy-checks/color-contrast/)**

  Color contrast refers to the difference between adjacent colors.
  Typically this is the text and background color.
  Some people cannot read text or find elements if there is insufficient contrast between colors.
  The contrast between text and background should be above 4.5:1.  
  The [Color Contrast Analyzer](https://developer.paciellogroup.com/resources/contrastanalyser/) is a tool that allows you to measure the contrasts.

- [ ] **9. [Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html) ([WCAG 1.4.1](https://w3.org/TR/WCAG21#use-of-color))**

  People with partial sight often experience limited color vision.
  That's why color should not be used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.
  Provide visual cues other than color (like underlining for links) to clarify the usage of interactive elements.

- [ ] **10. [Touch Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) ([WCAG 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum))**

  Using larger target sizes (e.g. for links or buttons) will help many people use targets more easily, especially if they utilize specialized input devices.

  - Touch targets must be at least 24 by 24 CSS pixels in size or
  - a virtual circle centered on the target with a diameter of 24 pixels does not intersect any other targets

### Proper Semantics

- [ ] **11. Use of Correct HTML Elements and Semantic Structure of the Page**

  Use the correct HTML elements for their intended functions and meaning (e.g. headlines for headings, paragraphs for text blocks, links for navigation, buttons for actions, lists for listings, tables for data, etc.).

  Employ HTML5 semantic elements (e.g. landmark elements <header>, <nav>, <main>, <footer>) to provide meaningful structure to the content.
  Semantic elements help screen readers and assistive technologies better understand the layout and purpose of the page, enhancing the browsing experience for users with disabilities and improving search engine optimization (SEO).

- [ ] **12. Enhanced HTML Markup**

  Use ARIA attributes to enhance accessibility and to provide additional context where native HTML elements are insufficient.
  Use additional attributes to enhance and describe elements if they contain no text.

### Images

- [ ] **13. [Image Alternative Text](https://www.w3.org/WAI/test-evaluate/easy-checks/image-alt/)**

  Image alternative text ("alt text") is used by people who do not see the image.
  It is a short description that conveys the purpose of a functional image or informative image.

- [ ] **14. Functional Images**

  A functional image is connected to an action.
  In addition to the alternative text the element should have a title or aria-label attribute to describe which action will be triggered.

- [ ] **15. Decorative Images**

  A decorative image is a visual element that doesn't add additional context or information that allows the user to better understand the context.
  It must be programmatically hidden from assistive technologies by

  - applying aria-hidden attribute or
  - using an empty or null text alternative or
  - adding the image as a CSS background

### Forms

- [ ] **16. [Labels](https://www.w3.org/WAI/test-evaluate/easy-checks/form-field-labels/)**

  Form field labels should tell us what information to enter or what checkbox to select.
  Ensure all form elements have associated and visible labels to provide context to users, especially those relying on assistive technologies.
  If not, add the appropriate ARIA attribute.

- [ ] **17. [Required Fields](https://www.w3.org/WAI/test-evaluate/easy-checks/required-fields/)**

  Marking which fields are required in a form makes it easier for everyone to complete forms.

## Project Accessibility Checklist

If projects migrate to the PWA 6.0, or customize the PWA, the following additional checks might be helpful.

Note: Project Customizations like styling adaptions, new or changed components etc. might require extra checks to secure the fulfillment of the WCAG 2.2. standards.

- [ ] **1. [Skip to Main Content Link](https://www.w3.org/WAI/test-evaluate/easy-checks/skip-link/)**

  A skip link is the first interactive element on a page.
  People using keyboards, screen readers and other assistive technologies can use skip links to quickly and easily reach the main page content.

- [ ] **2. [Language of Page](https://www.w3.org/WAI/test-evaluate/easy-checks/language/)**

  Specifying the language of the page means that assistive technology that speaks content can correctly pronounce words.

- [ ] **3. [Accessibility Statement](https://www.w3.org/WAI/planning/statements/)**

  An accessibility statement declares that a website has been designed and developed to be accessible to people with disabilities.
  It states that the website meets certain standards for usability, such as the WCAG.
  It is recommended to create the accessibility statement as a CMS page add an appropriate link to it in the CMS managed footer.
