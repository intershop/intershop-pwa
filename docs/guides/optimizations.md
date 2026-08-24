<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Optimizations

## NGINX Optimizations

- [NGINX Optimizations](#nginx-optimizations)
- [Further References](#further-references)

The NGINX building block applies:

- Compression of responses

[ngx_brotli](https://github.com/google/ngx_brotli) is used to compress files on NGINX because Brotli has a better compression ratio compared to gzip.
The configuration of the module is described in [Guide - Building and Running NGINX](./nginx-startup.md#brotli-configuration).

> [!NOTE]
> Brotli compression is typically only used over HTTPS connections. This is because most modern web browsers only advertise support for Brotli encoding to servers when the connection is secure (HTTPS).

## Further References

- [Guide - Building and Running NGINX Docker Image][nginx-startup]

[nginx-startup]: ./nginx-startup.md
