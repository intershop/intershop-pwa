# Guide - Handle rewritten ICM URLs in Hybrid Mode

If the ICM is set up with [URL Rewriting](https://support.intershop.com/kb/index.php/Display/28R955) further modifications are required to run the deployment with the [Hybrid Approach](../concepts/hybrid-approach.md).

The examples in this guide follow the default example for ICM URL Rewriting. In particular we want to focus on the following two examples:

- Product Detail Pages of the ICM
  - URLs are in the form `/Home-Entertainment/SmartHome/google-home-zid201807171`
  - they should be handled by the PWA in the form `/SmartHome/google-home-sku201807171`
- The help desk of the PWA
  - URLs are in the form `/page/systempage.helpdesk.index.pagelet2-Page` (generic content page)
  - this URL should be handled by the ICM: `/helpdesk`

## Mapping incoming rewritten ICM URLs to the PWA

Considering the example, the incoming Product Detail Page URL mapping must be included in the mapping table:

```typescript
  {
    id: 'Product Detail Page',
    icm: '(.*\\/)?(?<category>[\\w-]+)\\/(?<slug>[\\w-]+)-zid(?<sku>[\\w-]+)$',
    pwaBuild: `$<category>/$<slug>-$<sku>${PWA_CONFIG_BUILD}`,
    pwa: `^.*sku([\\w-]+)$`,
    // icmBuild not required
    handledBy: 'pwa'
  }
```

## Mapping PWA URLs to rewritten ICM URLs

First, the mapping table must be adapted to instruct the PWA to leave the single-page application, when switching to the help desk content page:

```typescript
export const ICM_WEB_URL = '/';

...

  {
    id: 'Helpdesk',
    icm: "${ICM_WEB_URL}helpdesk.*",
    // pwaBuild not required
    pwa: '^/page/systempage.helpdesk.index.pagelet2-Page$',
    icmBuild: 'helpdesk',
    handledBy: 'icm'
  }
```

Then, the nginx configuration must be adapted. The supplied nginx dynamically adds multi-site configuration parameters to dynamically configure the PWA depending on the incoming URL. The ICM cannot handle them, so traffic to the ICM must be excluded from adding those parameters. You can do this by extending the channel configuration:

_nginx/channel.conf.tmpl_:

```diff
     # let ICM handle everything ICM related
-    location ~* ^/INTERSHOP.*$ {
+    location ~* ^/(INTERSHOP|helpdesk).*$ {
         proxy_set_header Host $http_host;
```

Last but not least, the express.js server must be instructed to proxy traffic to `/helpdesk` to the ICM upstream:

_server.ts_:

```diff
   app.use('/INTERSHOP', icmProxy);
+  app.use('/helpdesk', icmProxy);
```

# Further References

- [Concept - Hybrid Approach](../concepts/hybrid-approach.md)
