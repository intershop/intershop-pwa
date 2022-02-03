<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Store Locator

To enable Store Locator, add `storeLocator` to the feature list in your environment file.
This will enable a page where users can search for stores based on a country, city and/or postal code.

# Google Maps Integration

Store Locator provides an optional Google Maps integration using the Google Maps JavaScript API.

This feature is optional and requires the backend to serve stores with latitude and longitude.

To enable Google Maps integration add `maps` to the feature list in your environment file and provide a API key as `gmaKey` in your environment file or via the `GMA_KEY` environment variable.

It's possible to provide custom images for the default and highlighted icons on the map.
To do so, provide a configuration object through the `STORE_MAP_ICON_CONFIGURATION` injection token in the `store-locator-routing.module.ts`.

Infos on how to obtain an API KEY can be found [here](https://developers.google.com/maps/documentation/javascript/get-api-key#creating-api-keys).
