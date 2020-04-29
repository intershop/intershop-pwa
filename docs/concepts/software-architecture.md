<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Software Architecture

This concept introduces some decisions made from an architectural point of view.

The Intershop Progressive Web App is a REST API based storefront client that works on top of the Intershop Commerce Management server version 7.10.
This means that the communication between the Angular based storefront and Intershop Commerce Management only functions via REST.
Customizations should fit into that REST based pattern as well.

## Overview

Please refer to [Angular - Architecture Overview](https://angular.io/guide/architecture) for an in-depth overview of how an Angular application is structured and composed.
In short, an Angular application consists of templates, components and services.
Templates contain the HTML that is rendered for the browser and displays the UI.
Services implement business functionality using [TypeScript](https://en.wikipedia.org/wiki/TypeScript).
Components are small and (mostly) independent bridges between services and templates that prepare data for display in templates and collect input from the user to interact with services.
Data binding links the template with methods and properties from the component.

Services should have a single responsibility by encapsulating all functionality required in it.
The API to a service should be as narrow as possible because services are used throughout the application.
It is also possible to combine functionality of multiple services in another more general service if necessary.

The components handling the templates should only handle view logic and should not implement too much specific functionalities.
If a component does more than just providing data for the template, it might be better to transfer this to service instances instead.

Multiple components and their respective templates are then composed to pages.
