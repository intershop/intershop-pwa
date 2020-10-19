# nginx Docker Image for Intershop Progressive Web App

Please refer to the [documentation](../docs/guides/nginx-startup.md) for configuration options.

## Example

1. Edit the file [`nginx/multi-channel.yaml`](multi-channel.yaml):
   ```yaml
   .+\.net:
     channel: inSPIRED-inTRONICS-Site
     lang: en_US
   .+\.de:
     channel: inSPIRED-inTRONICS-Site
     lang: de_DE
   .+\.com:
     channel: inSPIRED-inTRONICS_Business-Site
     features: quoting,businessCustomerRegistration,advancedVariationHandling
     theme: 'blue|688dc3'
   .+\.fr:
     channel: inSPIRED-inTRONICS-Site
     lang: fr_FR
     application: smb-responsive
     features: quoting
     theme: 'blue|688dc3'
   ```
2. Run the following from the project root:

   ```
   docker build -t my_awesome_nginx nginx
   docker run -d --name "my-awesome-nginx" \
           --restart always \
           -p 4199:80 \
           -e UPSTREAM_PWA=http://192.168.0.10:4200 \
           -e CACHE=off \
           -e PAGESPEED=off \
           my_awesome_nginx
   ```

3. Access the PWA with `http://<your-fully-qualified-machine-name>:4199`

If your DNS is not set up correctly, you have to use something like _dnsmasq_ (Linux) or _Acrylic DNS Proxy_ (Windows), or just ask your local network administrator.
