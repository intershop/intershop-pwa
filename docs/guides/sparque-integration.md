<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Sparque AI Integration

Sparque AI works as a search engine and delivers various information, like keyword suggestions, search results, filter options and category navigation.

## Configuration

To use the Sparque search engine, the following steps must be taken into account during deployment:

- store the correct sparque configuration as an environment variable [Sparque Config Model](../../src/app/core/models/sparque/sparque-config.model.ts)
- bind the SparqueSuggestionService as SuggestionService in the core module [Core Module](../../src/app/core/core.module.ts)

_core.module.ts_:

```
exchange:
{ provide: SuggestionService, useClass: ICMSuggestionService },
with:
{ provide: SuggestionService, useClass: SparqueSuggestionService },
```
