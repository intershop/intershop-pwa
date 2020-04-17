<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# End-to-End Testing with Cypress

## When to Write Cypress Tests?

With Angular most of the functionality of simple components or artifacts of the state management can be tested with [Unit Tests][guide-unit-tests].
However, when testing multiple artifacts at once, the `TestBed` definition can take a big amount of work.
Also considering, that not the real runtime modules are used in unit and module tests, it might be better to write short and concise [Cypress][cypress] tests for this functionality.

Testing issues with timing and interaction between many artifacts is also quite hard to implement as a unit test.

All in all, cypress testing should not be exhausting.
As a general rule only happy path and smoke tests should be implemented.

## Rules for Developing Cypress Tests

### Always Stick to Small Scope

Testing workflows with **many actions** can lead to **increased instability** when encountering browser hiccups.
Split tests into individual specs when possible.

### Pay Respect to Individuality

Every test should be **independent of other tests**.
So whenever a test is including a modification operation, it is best to create an individual user first.

### Do not Reinvent the Wheel

When testing functionality that needs to setup specific demo data first, do not create it via the user interface.
Instead write stable **REST API helper** methods, that can set up data faster via the API when the test starts.

### Stick to the PageObject Pattern

We introduced the [PageObject Pattern][concept-testing-pageobject] with the motivation of separating business-features from technical background.
So do not use HTML-specific selectors or exposed cypress functionality in tests if possible.

Also do not hide too much actions with the [PageObject Pattern][concept-testing-pageobject].
As a rule of thumb, whenever the user triggers an action, it should be represented by a line of code in the spec.

# Further References

- [Concept - Testing the PWA][concept-testing]
- [Guide - Unit Testing with Jest][guide-unit-tests]
- [Cypress Website][cypress]

[concept-testing]: ../concepts/testing.md
[concept-testing-pageobject]: ../concepts/testing.md#pageobject-pattern
[guide-unit-tests]: ./testing-jest.md
[cypress]: https://cypress.io
