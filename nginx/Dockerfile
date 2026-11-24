# Use the Azure-hosted Ubuntu mirror by default to avoid transient failures on
# archive.ubuntu.com / security.ubuntu.com during CI/CD pipeline builds.
# azure.archive.ubuntu.com is co-located with Azure and GitHub Actions infrastructure.
# To use a different mirror:  --build-arg UBUNTU_MIRROR=http://your-mirror/ubuntu/
# To disable and use the original Ubuntu repos: --build-arg UBUNTU_MIRROR=
ARG UBUNTU_MIRROR=http://azure.archive.ubuntu.com/ubuntu/
# Update the OpenResty source checksum in the build stage together with the version.
ARG OPENRESTY_VERSION=1.31.9.1

FROM openresty/openresty:${OPENRESTY_VERSION}-1-jammy AS buildstep
ARG UBUNTU_MIRROR
ARG OPENRESTY_VERSION
RUN if [ -n "$UBUNTU_MIRROR" ]; then \
    if [ -f /etc/apt/sources.list ]; then \
      sed -i "s|http://archive.ubuntu.com/ubuntu/|${UBUNTU_MIRROR}|g" /etc/apt/sources.list && \
      sed -i "s|http://security.ubuntu.com/ubuntu/|${UBUNTU_MIRROR}|g" /etc/apt/sources.list; \
    fi && \
    if [ -f /etc/apt/sources.list.d/ubuntu.sources ]; then \
      sed -i "s|http://archive.ubuntu.com/ubuntu/|${UBUNTU_MIRROR}|g" /etc/apt/sources.list.d/ubuntu.sources && \
      sed -i "s|http://security.ubuntu.com/ubuntu/|${UBUNTU_MIRROR}|g" /etc/apt/sources.list.d/ubuntu.sources; \
    fi; \
  fi && \
  apt-get update \
  && apt-get install --no-install-recommends --no-install-suggests -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev libbrotli-dev wget git gcc make

WORKDIR /app
# Dynamic modules must use the same patched NGINX source and the same configure arguments as the OpenResty image (bundled --add-module arguments excluded).
# ngx_brotli expects the Brotli headers in its git submodule; the symlink provides Ubuntu's headers instead.
RUN wget -q https://openresty.org/download/openresty-${OPENRESTY_VERSION}.tar.gz \
  && echo "71d49935bdc186dafc1f4b0a8ba44dba1bf4abc8ca52d4621f2039ec8fdcc95f  openresty-${OPENRESTY_VERSION}.tar.gz" | sha256sum -c - \
  && tar -zxf openresty-${OPENRESTY_VERSION}.tar.gz \
  && git clone https://github.com/google/ngx_brotli \
  && cd ngx_brotli \
  && git checkout 53e0fb55f250f48fe80c0ddbf6c0f7103cdbaae1 \
  && mkdir -p deps/brotli/c \
  && ln -s /usr/include deps/brotli/c/include \
  && cd .. \
  && cd openresty-${OPENRESTY_VERSION}/bundle/nginx-* \
  && eval "./configure $(openresty -V 2>&1 | sed -n 's/^configure arguments: //p' | sed -E 's/--add-module=[^ ]+//g') --add-dynamic-module=../../../ngx_brotli" \
  && make modules \
  && mkdir /app/modules \
  && cp objs/ngx_http_brotli_static_module.so objs/ngx_http_brotli_filter_module.so /app/modules/

FROM openresty/openresty:${OPENRESTY_VERSION}-1-jammy
ARG UBUNTU_MIRROR
RUN if [ -n "$UBUNTU_MIRROR" ]; then \
    if [ -f /etc/apt/sources.list ]; then \
      sed -i "s|http://archive.ubuntu.com/ubuntu/|${UBUNTU_MIRROR}|g" /etc/apt/sources.list && \
      sed -i "s|http://security.ubuntu.com/ubuntu/|${UBUNTU_MIRROR}|g" /etc/apt/sources.list; \
    fi && \
    if [ -f /etc/apt/sources.list.d/ubuntu.sources ]; then \
      sed -i "s|http://archive.ubuntu.com/ubuntu/|${UBUNTU_MIRROR}|g" /etc/apt/sources.list.d/ubuntu.sources && \
      sed -i "s|http://security.ubuntu.com/ubuntu/|${UBUNTU_MIRROR}|g" /etc/apt/sources.list.d/ubuntu.sources; \
    fi; \
  fi && \
  apt-get update \
  && apt-get install --no-install-recommends --no-install-suggests -y apache2-utils libbrotli1 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
COPY --from=nginx:mainline /docker-entrypoint.sh /
COPY --from=nginx:mainline /docker-entrypoint.d/*.sh /docker-entrypoint.d/
COPY lua/*.lua /usr/local/openresty/lualib/
RUN ln -s /usr/local/openresty/nginx/conf/mime.types /etc/nginx/ \
  && useradd -Ms /bin/false nginx \
  && mkdir -p /etc/resolvconf/resolv.conf.d \
  && echo "nameserver 8.8.8.8" >> /etc/resolvconf/resolv.conf.d/tail \
  && luarocks install lua-resty-redis-connector
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]
COPY nginx.conf.tmpl /etc/nginx/nginx.conf.tmpl
COPY features /etc/nginx/features/
COPY loglevel /etc/nginx/loglevel/
COPY templates /etc/nginx/templates/
COPY docker-entrypoint.d/*.sh /docker-entrypoint.d/
RUN chmod 700 /docker-entrypoint.d/*.sh
COPY *.yaml /
COPY 50x.html /usr/share/nginx/html/
COPY llms /etc/nginx/conf.d/llms/

COPY cache_clearer.sh /
RUN chmod 700 /cache_clearer.sh

COPY --from=hairyhenderson/gomplate:v5.0.0 /gomplate /gomplate
RUN chmod 700 /gomplate
COPY --from=nginx/nginx-prometheus-exporter:1.5.1 /usr/bin/nginx-prometheus-exporter /nginx-prometheus-exporter
COPY --from=buildstep /app/modules/ /etc/nginx/modules/
ENV CACHE=on
ENV COMPRESSION=on
ENV DEVICE_DETECTION=on
ENV SSR=on
ENV SSL=off
ENV CACHE_DURATION_NGINX_OK=10m
ENV CACHE_DURATION_NGINX_NF=60m
ENV LOGLEVEL=error
ENV LOGFORMAT=json

EXPOSE 80 443 9113
