# nginx Docker Image for Intershop Progressive Web App

Please refer to the [documentation](../docs/guides/nginx-startup.md) for configuration options.

## Example

From the project root:

```
docker build -t my_awesome_nginx nginx
docker run -d --name "my-awesome-nginx" \
        --restart always \
        -p 4199:80 \
        -e UPSTREAM_PWA=http://192.168.0.10:4200 \
        -e CACHE=off \
        -e PAGESPEED=off \
        -e PWA_1_TOPLEVELDOMAIN=net \
        -e PWA_1_CHANNEL=inSPIRED-inTRONICS-Site \
        -e PWA_1_LANG=en_US \
        -e PWA_2_TOPLEVELDOMAIN=de \
        -e PWA_2_CHANNEL=inSPIRED-inTRONICS-Site \
        -e PWA_2_LANG=de_DE \
        -e PWA_3_TOPLEVELDOMAIN=com \
        -e PWA_3_CHANNEL=inSPIRED-inTRONICS_Business-Site \
        -e PWA_3_FEATURES=quoting,recently,compare,businessCustomerRegistration,advancedVariationHandling \
        -e PWA_3_THEME="blue|688dc3" \
        -e PWA_4_TOPLEVELDOMAIN=fr \
        -e PWA_4_LANG=fr_FR \
        -e PWA_4_CHANNEL=inSPIRED-inTRONICS-Site \
        -e PWA_4_APPLICATION=smb-responsive \
        -e PWA_4_FEATURES=quoting \
        -e PWA_4_THEME="blue|688dc3" \
        my_awesome_nginx
```

And then access the PWA with `http://b2b.<your-fully-qualified-machine-name>:4199`

If your DNS is not set up correctly, you have to use something like _dnsmasq_ (Linux) or _Acrylic DNS Proxy_ (Windows), or just ask your local network administrator.
