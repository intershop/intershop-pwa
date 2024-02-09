<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Sparque AI Integration

Sparque AI works as a search engine and delivers various information, like keyword suggestions, search results, filter options and category navigation.

## Requirements

The best way to use Sparque AI is to use it together with the Intershop Sparque Policy Enforcer.
The Sparque Policy Enforcer ensures that the current user of the PWA calls the correct workspace in Sparque AI and solves possible CORS problems.
In order to use this approach, your system requirements are:

- use an instance of the Policy Enforcer, by either using a prepared service or run it as a local docker image
- ICM 11.2 (changes to the JWT Token become available in that version)
- feature flag "intershop.search.sparque" needs to be turned on (=true)
- PWA version (4? //TODO)
- sparque endpoint configuration in PWA is pointing to Policy Enforcer URL

There are options to use Sparque AI directly with the PWA by configuring sparque endpoint in PWA directly to sparque.
CORS problems will have to be taken care of.
Also there is no extended security or managing of workspaces.

## Configuration

### Intershop Commerce Management (ICM)

The minimum version requirement for ICM is 11.2.
In this version, the JWT token can be extended for Sparque AI.
In order to use this feature, JWT Token needs to be turned on (per default since ICM11).
Also the feature flag for sparque needs to be turned on like "intershop.search.sparque=true".

### Intershop Progressive Web App (PWA)

The Sparque feature flag needs to be set in PWA, as well as the endpoint to either Sparque AI Policy Enforcer or Sparque AI directly.

### Intershop Policy Enforcer

The Policy Enforcer can be adjusted to the planned use for Sparque AI.
The most important configurations include

- TARGET_URI=https://rest.sparque.ai # the target uri to sparque
- ALLOW_CORS_ORIGINS=http://localhost:4200 http://pwa:4200 # cors setting
- WORKSPACE_KEYS="inSPIRED-inTRONICS_Business-Site" # channels to match against the workspaces
- WORKSPACE_VALUES="intershop-obi" # workspaces to be matched from the channels

## Workflow

When the `sparque` feature flag is turned on, some requests will be routed to Sparque AI/Sparque Policy Enforcer instead of the ICM.
The current list of interactions with sparque is following:

- ProductsService -> searchProducts, getFilteredProducts, getCategoryProducts
- SuggestService -> search
- FilterService -> getFilterForCategory, getFilterForSearch, applyFilter
- CategoriesService -> getTopLevelCategories

To adjust which services should be called, the services.modules.ts can be modified.

## Further References

- [Concept - Configuration](../concepts/configuration.md)
