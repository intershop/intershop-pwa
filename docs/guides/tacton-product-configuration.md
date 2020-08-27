<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Extended Product Configurations with Tacton

We integrated [Tacton CPQ](https://www.tacton.com/solutions/tacton-cpq) for handling complex product configuration scenarios.

The PWA uses the self-service API to interactively configure a product and submit a firm proposal to Tacton CPQ.

## Setup

First, activate the feature toggle `tacton`.
You will also have to provide an endpoint and mapping configuration.
This can be done by defining it in [Angular CLI environment](../concepts/configuration.md#angular-cli-environments) files:

```typescript
export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  tacton: {
    selfService: {
      endPoint: '<tacton-endpoint>', // without '/self-service-api'
      apiKey: '<self-service API key>'
    },
    productMappings: {
      '<ICM-SKU>': '<tab-category>/<tacton-product-id>',
      ...
    }
  },
};
```

This configuration can also be supplied via environment variable `TACTON` as stringified JSON:

```text
TACTON='{ "selfService": { "endPoint": "<tacton-endpoint>", "apiKey": "<self-service API key>" }, "productMappings": { "<ICM-SKU>": "<tab-category>/<tacton-product-id>", ... } }';
```

## Product Mappings

Currently we only support product mappings via configuration.
In the future we will consider supporting specific custom attributes configurable via ICM back office.

## Workflow

When encountering a configurable product, the PWA directs to the configuration page, where the product can be composed.
The PWA supports committing and un-committing various parameters with available UI elements.
When encountering configuration conflicts, the user is queried for accepting a given conflict resolution or discarding the last changes.
Upon completing the last step, the user can submit the configuration.
This creates a cart with required user attributes on the Tacton CPQ side and submits a Firm Proposal.

## Further References

- [Concept - Configuration](../concepts/configuration.md)
