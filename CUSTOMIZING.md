# Intershop Progressive Web App - Customization Guide

When customizing the PWA always keep in mind, that you probably want to upgrade from time to time and will have to merge incoming changes into your codebase. We therefore suggest that you don't edit existing files all too much and keep them as intact as possible. In this document we provide a couple of rules that you should follow. Generally speaking:

> Keep modifications on existing files as minimal as possible!

It can be tempting to always modify existing templates, component and style files inline when doing customization. However, when merging incoming upgrades the number of merge conflicts can possibly be big. So if you want to upgrade to new PWA versions later, stick to the following recommendations.

## Components

When **adding new functionality**, it is better to encapsulate it in **new components** that handle every aspect of the customization and just **use them in existing templates**. That way the modifications on existing code is most often kept to a single line change only.

When **heavily customizing** existing components it is better to **copy components** and change all references. If 20% of the component has to be changed it is already a good idea to duplicate it. That way incoming changes won't affect your customizations. Typical hot-spots where copying is a good idea are header-related or product-detail page related customizations.

## Existing Features

When you want to **disable code** provided by Intershop, it is better to **comment it out instead of deleting** it. This allows Git to merge changes more predictably since original and incoming passages are still similar to each other. Commenting out should be done in the form of block comments starting a line above and ending in an additional line below the code. Use `<!--` and `-->` for HTML and `/*` and `*/` for SCSS and TypeScript.

Some of the provided components supply **configuration parameters** which can be used to handle customization in an easy way (i.e. disabling features or switching between them).

## New Features

When adding new independent features to the PWA it might be a good idea to **add an extension** first. Use the provided schematics `ng g extension <name>` to scaffold the extension. Adding all related pages, components, models and services here is less intrusive than adding them to the existing folder structure. Add additional artifacts to extensions by supplying the `--extension` flag to schematics calls.

## Data

When **adding new fields** to PWA data models, add them to interfaces and properly **map them as early as possible** in mapper classes to model classes. That way the data can be readily used on templates. If improving and parsing improper data too late it could lead to more modifications on components and templates which will be harder to upgrade later on.

## NgRx

Adding **new data** to the state should always almost exclusively be done by adding new stores in **store groups**. Add one with `ng g store-group <group>` and then add consecutive stores with `ng g store --feature <group> <store>`. Keep modifications to the existing store as little as possible. As NgRx is by nature loosely coupled, you can deactivate effects by simply commenting out the `@Effect` decorator.

## Testing

When modifying components it is most likely that related test cases will fail. When possible use the jest update feature **update snapshots** when adapting test cases. If you upgrade the PWA to a new version those snapshots will most likely have merge conflicts in them. Here you can just accept either modification and update the test snapshots.

## Styling

Changing the styling of **existing components** can be done by changing relevant information in the global style files under `src/theme`. If too many changes have to be made it is better to **add the styling in additional files on global or component level**.

When styling on component level all styling is being encapsulated to just this component (default behavior). You can re-use variables from global styling on component level by adding imports like `@import '~theme/variables.scss';`.

## Dependencies

When updating dependencies and resolving conflicts inside of `package-lock.json`, always **accept Intershop's changes** first. After that run `npm install` to regenerate the file.
