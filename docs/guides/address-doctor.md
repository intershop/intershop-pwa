<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Address Check with Address Doctor

We integrated [Address Doctor](https://www.informatica.com/de/products/data-quality/data-as-a-service/address-verification.html) to verify address data for correctness.

## Setup

First, activate the feature toggle `addressDoctor`.
You will also have to provide the endpoint and additional verification data.
This can be done by defining it in [Angular CLI environment](../concepts/configuration.md#angular-cli-environments) files:

```typescript
export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  addressDoctor: {
    url: '<addressDoctor-url>',
    login: '<addressDoctor-login>',
    password: '<addressDoctor-password>',
    maxResultCount: 5,
  },
```

This configuration can also be supplied via environment variable `ADDRESS_DOCTOR` as stringified JSON:

```text
ADDRESS_DOCTOR='{ "addressDoctor": { "url": "<addressDoctor-url>", "login": "<addressDoctor-login>", "password": "<addressDoctor-password>", "maxResultCount": "5" } }';
```

## Workflow

To check an address with the address doctor the PWA needs to render the `<ish-lazy-address-doctor>` component.
When the user submits the address data, the PWA needs to send a [feature notification event](../../src/app/core/utils/feature-event/feature-event.service.ts) with the request to check the data.

```typescript
const id = this.featureEventService.sendNotification('addressDoctor', 'check-address', {
  address,
});
```

This method will submit the address data to the Address Doctor REST API and open a modal with all suggestions.
The user needs to decide and confirm the address, which is the correct one.
With the subscribe on the [eventResultListener$](../../src/app/core/utils/feature-event/feature-event.service.ts) observable, the initial component can react on the confirmation data.

```typescript
this.featureEventService
  .eventResultListener$('addressDoctor', 'check-address', id)
  .pipe(whenTruthy(), take(1), takeUntilDestroyed(this.destroyRef))
  .subscribe(({ address }) => {
    if (address) {
      this.accountFacade.updateCustomerAddress(address);
    }
  });
```

## Further References

- [Concept - Configuration](../concepts/configuration.md)
