---
applyTo: '**'
---

## What NOT to Do in Intershop PWA

- ❌ Put business logic directly in templates (keep templates for presentation only)
- ❌ Use `any` as a type
- ❌ Use long, multi-responsibility methods in components
- ❌ Nest `subscribe()` calls (use RxJS chaining and operators instead)
- ❌ Mutate inputs or observable streams directly
- ❌ Use inline style manipulation
- ❌ Use hardcoded magic strings (use constants or enums instead)
