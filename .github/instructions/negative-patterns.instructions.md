---
applyTo: '**'
---

## What NOT to Do in Intershop PWA

- ❌ Put business logic directly in templates (keep templates for presentation only)
- ❌ Use `any` as a type
- ❌ Add `| undefined` to types (`strictNullChecks` is off, so every type already includes `undefined`; mark optional properties with `?` instead)
- ❌ Mix optional and mandatory properties in interfaces and types (list the mandatory properties first, then the optional ones)
- ❌ Use long, multi-responsibility methods in components
- ❌ Nest `subscribe()` calls (use RxJS chaining and operators instead)
- ❌ Mutate inputs or observable streams directly
- ❌ Use inline style manipulation
- ❌ Use hardcoded magic strings (use constants or enums instead)
- ❌ Use `crypto.randomUUID()` (generate UUIDs with `import { v4 as uuid } from 'uuid'`; `crypto.randomUUID()` is only available in secure contexts)
