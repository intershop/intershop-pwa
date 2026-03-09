# Intershop PWA - GitHub Copilot Instructions

## Project Overview

Angular 18-based Progressive Web App for enterprise commerce. Built for performance, maintainability, SSR, and extensibility.

## Technology Stack

- Angular 18.2, TypeScript 5.5, NgRx, Node.js 22
- Express.js (SSR), Bootstrap 5, Jest + Cypress
- REST APIs only, RxJS for reactive flows

## Architecture Principles

- Component = View logic only
- Business logic in services/facades
- NgRx for state, EntityAdapter for normalization
- SSR via Angular SSR + Express
- Lazy loaded modules for performance

## Naming & Structure

- **Naming Patterns:** See [naming patterns instructions](./instructions/naming-patterns.instructions.md)
- **Components:** `src/app/pages/`, `src/app/shared/components/`
- **Services:** `src/app/core/services/`
- **State:** `src/app/core/store/`
- **Models:** `src/app/core/models/`
- **Guards:** `src/app/core/guards/`
- **Interceptors:** `src/app/core/interceptors/`
- **Directives:** `src/app/core/directives/`
- **Pipes:** `src/app/core/pipes/`

## Code Patterns

- **Component Patterns:** See [component patterns instructions](./instructions/component-patterns.instructions.md)
- **Service Patterns:** See [service patterns instructions](./instructions/service-patterns.instructions.md)
- **State Management:** See [state management patterns instructions](./instructions/state-management-patterns.instructions.md)
- **Testing Patterns:** See [testing patterns instructions](./instructions/testing-patterns.instructions.md)
- **Error Handling:** See [error handling instructions](./instructions/error-handling.instructions.md)
- **Performance:** See [performance patterns instructions](./instructions/performance-patterns.instructions.md)
- **Styling:** See [styles instructions](./instructions/styles.instructions.md)
- **CI/CD Workflows:** See [workflows instructions](./instructions/workflows.instructions.md)

## Anti-Patterns to Avoid

See [negative patterns instructions](./instructions/negative-patterns.instructions.md) for comprehensive list of patterns to avoid.

## Formatting & Linting

- **Enforced by ESLint/Prettier** - see `.eslintrc.json` and `.prettierrc`
- **Key formatting:** single quotes, 2 spaces, semicolons
- **Angular prefixes:** Components use `ish-`, directives use `ish`
- **Format command:** `npm run format`
- **Lint command:** `npm run lint` (auto-fixes issues)
- **Dead code detection:** `npx ts-node scripts/find-dead-code.ts`

## Build & Test

- `npm run build` — production build
- `npm run test` — unit tests via Jest
- `npm run e2e` — end-to-end tests via Cypress
- `ng serve` — local development

## Documentation

For comprehensive documentation including developer guides, architectural concepts, and operational setup, see:

- [Documentation Overview](../docs/README.md) - Complete index of all available documentation
