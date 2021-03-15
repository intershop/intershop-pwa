<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Unit Testing with Jest

- [Unit Testing with Jest](#unit-testing-with-jest)
  - [Stick to General Unit Testing Rules](#stick-to-general-unit-testing-rules)
    - [Single Responsibility](#single-responsibility)
    - [Test Functionality - Not Implementation](#test-functionality---not-implementation)
    - [Do not Comment out Tests](#do-not-comment-out-tests)
    - [Always Test the Initial State of a Service/Component/Module/...](#always-test-the-initial-state-of-a-servicecomponentmodule)
    - [Do not Test the Obvious](#do-not-test-the-obvious)
    - [Make Stronger Assertions](#make-stronger-assertions)
    - [Do not Meddle with the Framework](#do-not-meddle-with-the-framework)
  - [Assure Readability of Tests](#assure-readability-of-tests)
    - [Stick to Meaningful Naming](#stick-to-meaningful-naming)
    - [Avoid Global Variables](#avoid-global-variables)
    - [Avoid Code Duplication in Tests](#avoid-code-duplication-in-tests)
    - [Do not Use Features You Do not Need](#do-not-use-features-you-do-not-need)
    - [Structure Long Tests](#structure-long-tests)
    - [Avoid Having Dead Code](#avoid-having-dead-code)
    - [Use a Mocking Framework Instead of Dealing with Stubbed Classes](#use-a-mocking-framework-instead-of-dealing-with-stubbed-classes)
  - [Do not Change Implementation to Satisfy Tests](#do-not-change-implementation-to-satisfy-tests)
    - [DOM Element Selection](#dom-element-selection)
    - [DOM Changes for Tests](#dom-changes-for-tests)
  - [Stick to Intershop Conventions Regarding Angular Tests](#stick-to-intershop-conventions-regarding-angular-tests)
    - [Every Component Should Have a 'should be created' Test](#every-component-should-have-a-should-be-created-test)
    - [Choose the Right Level of Abstraction](#choose-the-right-level-of-abstraction)
  - [Be Aware of Common Pitfalls](#be-aware-of-common-pitfalls)
    - [Be Careful When Using `toBeDefined`](#be-careful-when-using-tobedefined)
    - [Be Careful With Variable Initialization](#be-careful-with-variable-initialization)
    - [Use the right way to test EventEmitter](#use-the-right-way-to-test-eventemitter)

## Stick to General Unit Testing Rules

### Single Responsibility

A test should test only one thing.
One given behavior is tested in one and _only_ one test.

The tests should be independent from others, that means no chaining and no run in a specific order is necessary.

### Test Functionality - Not Implementation

A test is implemented incorrectly or the test scenario is meaningless if changes in the HTML structure of the component destroy the test result.

Example: The test fails if an additional input field is added to the form.

:warning: **Wrong Test Scenario**

```typescript
it('should check if input fields are rendered on HTML', () => {
  const inputFields = element.getElementsByClassName('form-control');
  expect(inputFields.length).toBe(4);
  expect(inputFields[0]).toBeDefined();
  expect(inputFields[1]).toBeDefined();
  expect(inputFields[2]).toBeDefined();
});
```

### Do not Comment out Tests

Instead use the `xdescribe` or `xit` feature (just add an '`x`' before the method declaration) to exclude tests.
This way excluded tests are still visible as skipped and can be repaired later on.

:heavy_check_mark:

```typescript
xdescribe("description", function() {
  it("description", function() {
    ...
  });
});
```

### Always Test the Initial State of a Service/Component/Module/...

This way the test itself documents the initial behavior of the unit under test.
Especially if you test that your action triggers a change: Test for the previous state!

:heavy_check_mark:

```typescript
it('should call the cache when data is available', () => {
    // precondition
    service.getData();
    expect(cacheService.getChachedData).not.toHaveBeenCalled();

    << change cacheService mock to data available >>

    // test again
    service.getData();
    expect(cacheService.getChachedData).toHaveBeenCalled();
});
```

### Do not Test the Obvious

Testing should not be done for the sake of tests existing:

- It is not useful to test getter and setter methods and use spy on methods which are directly called later on.
- Do not use assertions which are logically always true.

### Make Stronger Assertions

It is easy to always test with `toBeTruthy` or `toBeFalsy` when you expect something as a return value, but it is better to make stronger assertions like `toBeTrue`, `toBeNull` or `toEqual(12)`.

:warning:

```typescript
it('should cache data with encryption', () => {
  customCacheService.storeDataToCache('My task is testing', 'task', true);
  expect(customCacheService.cacheKeyExists('task')).toBeTruthy();
});
```

:heavy_check_mark:

```typescript
it('should cache data with encryption', () => {
  customCacheService.storeDataToCache('My task is testing', 'task', true);
  expect(customCacheService.cacheKeyExists('task')).toBeTrue();
});
```

Again, do not rely too much on the implementation.
If user customizations can easily break the test code, your assertions are too strong.

:warning: **Test too Close to Implementation**

```typescript
it('should test if tags with their text are getting rendered on the HTML', () => {
  expect(element.getElementsByTagName('h3')[0].textContent).toContain('We are sorry');
  expect(element.getElementsByTagName('p')[0].textContent).toContain(
    'The page you are looking for is currently not available'
  );
  expect(element.getElementsByTagName('h4')[0].textContent).toContain('Please try one of the following:');
  expect(element.getElementsByClassName('btn-primary')[0].textContent).toContain('Search');
});
```

:heavy_check_mark: **Same Test in a more Stable Way**

```typescript
it('should test if tags with their text are getting rendered on the HTML', () => {
  expect(element.getElementsByClassName('error-text')).toBeTruthy();
  expect(element.getElementsByClassName('btn-primary')[0].textContent).toContain('Search');
});
```

### Do not Meddle with the Framework

Methods like `ngOnInit()` are lifecycle-hook methods which are called by Angular – The test should not call it directly.
When doing component testing, you most likely use `TestBed` anyway, so use the `detectChanges()` method of your available `ComponentFixture`.

:warning: **Wrong Test with ngOnInit() Method Calling**

```typescript
it('should call ngOnInit method', () => {
  component.ngOnInit();
  expect(component.loginForm).toBeDefined();
});
```

:heavy_check_mark: **Test without ngOnInit() Method Call**

```typescript
it('should contain the login form', () => {
  fixture.detectChanges();
  expect(component.loginForm).not.toBeNull();
});
```

## Assure Readability of Tests

### Stick to Meaningful Naming

The test name describes perfectly what the test is doing.

:warning: **Wrong Naming**

```typescript
it ('wishlist test', () => {...})
```

:heavy_check_mark: **Correct Naming**

```typescript
it ('should add a product to an existing wishlist when the button is clicked', () => {...})
```

Basically it should read like a documentation for the unit under test, not a documentation about what the test does. [Jasmine](https://jasmine.github.io) has named the methods accordingly.
Read it like \`I am describing <component>, it should <do> when/if/on <condition/trigger> (because/to <reason>)\`.

This also applies to assertions.
They should be readable like meaningful sentences.

:warning:

```typescript
const result = accountService.isAuthorized();
expect(result).toBeTrue();
```

:heavy_check_mark:

```typescript
const authorized = accountService.isAuthorized();
expect(authorized).toBeTrue();
```

or directly

```typescript
expect(accountService.isAuthorized()).toBeTrue();
```

### Avoid Global Variables

Tests should define Variables only in the scope where they are needed.
Do not define Variables before `describe` or respective `it` methods.

### Avoid Code Duplication in Tests

This increases readability of test cases.

- Common initialization code of constants or sub-elements should be located in `beforeEach` methods.
- When using `TestBed` you can handle injection to variables in a separate `beforeEach` method.

:warning:

```typescript
it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    ...
});
it('should have the title "app"', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
   ...
});
it('should match the text passed in Header Component', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
});
```

:heavy_check_mark:

```typescript
describe('AppComponent', () => {
    let translate: TranslateService;
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ... ] });
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    })
    it('should create the app', () => { ... });
    it(\`should have as title 'app'\`, () => { ... });
    it('should match the text passed in Header Component', () => { ... });
});
```

### Do not Use Features You Do not Need

This increases readability of test cases.

If you do not need the functionality of :

- `ComponentFixture.debugElement`
- `TestBed`
- `async, fakeAsync`
- `inject`

... do not use it.

:warning: **Wrong Test With Useless Features (TestBed, ComponentFixture.debugElement)**

```typescript
it('should create the app', async(() => {
  const app = fixture.debugElement.componentInstance;
  expect(app).toBeTruthy();
}));
```

:heavy_check_mark: **Same Test - Works Without These Features**

```typescript
it('should be created', () => {
  const app = fixture.componentInstance;
  expect(app).toBeTruthy();
});
```

### Structure Long Tests

The `describe` methods in Jasmine are nestable.
You can use this to group various `it` methods into a nested `describe` where you can also use an additional `beforeEach` initialization method.

:heavy_check_mark: **Nested describe Methods**

```typescript
describe('AccountLogin Component', () => {
    it('should be created', () => { ... });
    it('should check if controls are rendered on Login page', () => { ... });
    ....
    describe('Username Field', () => {
        it('should be valid when a correct email is assigned', () => { ... });
       ....
    });
});
```

### Avoid Having Dead Code

Always only declare what you need.
Unused variables, classes and imports reduce the readability of unit tests.

### Use a Mocking Framework Instead of Dealing with Stubbed Classes

This way less code needs to be implemented which again increases readability of unit tests.
Also mocks can be stubbed on time, depending on the current method.
We decided to use [ts-mockito](https://github.com/NagRock/ts-mockito) as the Test Mocking Framework.

## Do not Change Implementation to Satisfy Tests

### DOM Element Selection

Use only IDs or definite class names to select DOM elements in tests.
Try to avoid general class names.

:warning: **Wrong Selector**

```typescript
const selectedLanguage = element.getElementsByClassName('d-none');
```

:heavy_check_mark: **Correct Selector**

```typescript
// by id

const selectedLanguage = element.querySelector('#language-switch');

// by class

const selectedLanguage = element.getElementsByClassName('language-switch');
```

### DOM Changes for Tests

Use `data-testing-id` via attribute binding to implement an identifier used for testing purpose only.

:heavy_check_mark: **Correct Testing ID**

\*.component.html

```html
<ol class="viewer-nav">
  <li *ngFor="let section of sections" [attr.data-testing-id]="section.value">{{ section.text }}</li>
</ol>
```

\*.spec.ts

```typescript
element.querySelectorAll('[data-testing-id]')[0].innerHTML;

element.querySelectorAll("[data-testing-id='en']").length;
```

> :warning: **Note**
> Do not overuse this feature!

## Stick to Intershop Conventions Regarding Angular Tests

### Every Component Should Have a 'should be created' Test

Every component should have a 'should be created' test like the one Angular CLI auto-generates.
This test handles runtime initialization Errors.

:heavy_check_mark:

```typescript
it('should be created', () => {
  expect(component).toBeTruthy();
  expect(element).toBeTruthy();
  expect(() => fixture.detectChanges()).not.toThrow();
});
```

### Choose the Right Level of Abstraction

- When working mainly with stubs for specific services which mock dependencies of services under test, you should mainly use spies to check whether the right methods of the stub are called.
- When working mainly with fully configured services, it is best to check return values.
- When testing complex scenarios (e.g., when the test has to handle multiple pages), it might be better to implement a Geb+Spock end to end test.

See [Three Ways to Test Angular Components](https://vsavkin.com/three-ways-to-test-angular-2-components-dcea8e90bd8d) for more information.

## Be Aware of Common Pitfalls

### Be Careful When Using `toBeDefined`

Be careful when using `toBeDefined`, because a dynamic language like JavaScript has another meaning of defined (see: [Is It Defined? toBeDefined, toBeUndefined](http://www.safaribooksonline.com/library/view/javascript-testing-with/9781449356729/ch04.html)).

> :warning: **Warning**  
> Do not use `toBeDefined` if you really want to check for not null because technically 'null' is defined. Use `toBeTruthy` instead.

### Be Careful With Variable Initialization

Jasmine does not automatically reset all your variables for each test like other test frameworks do.
If you initialize directly under `describe`, the variable is initialized only once.

> :warning: **Warning**  
> Since tests should be independent of each other, do not do this.

```typescript
describe('...', () => {
  let a = true; // initialized just once
  const b = true; // immutable value
  let c; // re-initialized in beforeEach

  beforeEach(() => {
    c = true;
  });

  it('test1', () => {
    a = false;
    // b = false; not possible
    c = false;
  });

  it('test2', () => {
    // a is still false
    // c is back to true
  });
});
```

As shown in the above example, `a` shows the wrong way of initializing variables in tests.

If you do not need to change the value, use a `const` declaration for primitive variables like `b`.
If you need to change the value in some tests, assure it is reinitialized each time in the `beforeEach` method like `c`.

A `const` declaration like `b` should not be used for complex values, as the object behind `b` is still mutable and has to be re-initialized properly:

```typescript
describe('...', () => {
  let a: any;
  const b = { value: true };

  beforeEach(() => {
    a = { value: true };
  });

  it('test1', () => {
    a.value = false;
    b.value = false;
  });

  it('test2', () => {
    // a.value is back to true
    // b.value is still false
  });
});
```

### Use the right way to test EventEmitter

Testing `EventEmitter` firing can be done in multiple ways that have advantages and disadvantages.
Consider the following example:

```typescript
import { EventEmitter } from '@angular/core';
import { anything, capture, deepEqual, spy, verify } from 'ts-mockito';

describe('Emitter', () => {
  class Component {
    valueChange = new EventEmitter<{ val: number }>();

    do() {
      this.valueChange.emit({ val: 0 });
    }
  }

  let component: Component;

  beforeEach(() => {
    component = new Component();
  });

  it('should detect errors using spy with extract', () => {
    // *1*
    const emitter = spy(component.valueChange);

    component.do();

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({ val: 0 });
  });

  it('should detect errors using spy with deepEqual', () => {
    // *2*
    const emitter = spy(component.valueChange);

    component.do();

    verify(emitter.emit(deepEqual({ val: 0 }))).once();
  });

  it('should detect errors using subscribe', done => {
    // *3*
    component.valueChange.subscribe(data => {
      expect(data).toEqual({ val: 0 });
      done();
    });

    component.do();
  });
});
```

As `EventEmitter` is `Observable`, subscribing to it might be the most logical way of testing it.
We, however, would recommend using [ts-mockito](https://github.com/NagRock/ts-mockito) to increase readability.
The ways 1 and 2 portrait two options, we would recommend using the first one.

|                                | 1 (preferred)                                                                                                                     | 2                                                                          | 3                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Description                    | - Using ts-mockito spy and then verify it has fired - Then check argument for expected value                                      | Using ts-mockito spy and then verify it has fired with the expected value  | - Using subscription and asynchronous method safeguard                       |
| Readability                    | Capturing arguments with ts-mockito might seem tricky and therefore reduces readability, but the test is done in the right order. | :heavy_check_mark: Right order, fewest lines of code                       | :warning: Order is reversed.                                                 |
| In case it does not emit       | :heavy_check_mark: Correct line number and a missing emission is reported.                                                        | :heavy_check_mark: Correct line number and a missing emission is reported. | :warning: Test runs into timeout as the asynchronous callback is not called. |
| In case it emits another value | :heavy_check_mark: Correct line number and an incorrect value is reported.                                                        | :warning: Missing emission is reported.                                    | :heavy_check_mark: Correct line number and an incorrect value is reported.   |
