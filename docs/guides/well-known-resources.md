<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Well-Known Resources

- [Apple App Site Association](#apple-app-site-association)
  - [Configuring the PWA to Serve the AASA File](#configuring-the-pwa-to-serve-the-aasa-file)
- [Further References](#further-references)

The `/.well-known/` directory is a standardized location defined by [RFC 8615](https://datatracker.ietf.org/doc/html/rfc8615).
It is used to host configuration files and metadata that allow external services (such as mobile app linking, authentication, or security policies) to integrate with the application.

This guide explains how to configure the PWA to serve files from the `/.well-known/` directory at the root of a web server.

## Apple App Site Association

> The AASA (short for apple-app-site-association) is a file that lives on your website and associates your website domain with your native app (see [What Is An AASA (apple-app-site-association) File?](https://www.branch.io/resources/blog/what-is-an-aasa-apple-app-site-association-file/)).

A detailed guide on how to create the `apple-app-site-association` file can be found at [Apple Developer: Supporting Associated Domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains).

### Configuring the PWA to Serve the AASA File

Perform the following steps.

1. **Save the AASA File**

   Place the file `apple-app-site-association` in the `nginx` folder.

2. **Dockerfile Adaption**

   Add the following lines to `nginx/Dockerfile`:

   ```dockerfile
   RUN mkdir -p /usr/share/nginx/html/.well-known
   COPY apple-app-site-association /usr/share/nginx/html/.well-known/apple-app-site-association
   ```

3. **Multi-Channel Configuration**

   Add the following `location` block to the `nginx/templates/multi-channel.conf.tmpl` file within the `server` block and next to the existing `location` blocks:

   ```nginx
   # apple-app-site-association
   location = /.well-known/apple-app-site-association {
       allow all;
       auth_basic off;

       default_type application/json;
       root /usr/share/nginx/html;
   }
   ```

   > [!NOTE]
   > The `auth_basic off;` directive ensures that this endpoint remains publicly accessible even when global `BASIC_AUTH` is enabled for the PWA.

4. **Verify the Configuration**

   Test the endpoint after deployment:

   ```bash
   curl -i https://yourdomain.com/.well-known/apple-app-site-association
   ```

   The endpoint should return `Content-Type: application/json` with the JSON content.

   To test the `apple-app-site-association` file when running the PWA on your local system, you can use the following commands:

   ```bash
   docker compose up --build -d
   curl -i http://localhost:4200/.well-known/apple-app-site-association
   ```

## Further References

- [RFC 8615: Well-Known Uniform Resource Identifiers (URIs)](https://datatracker.ietf.org/doc/html/rfc8615)
- [Apple Developer: Supporting Associated Domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains)
