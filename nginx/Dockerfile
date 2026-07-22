# Use the Azure-hosted Ubuntu mirror by default to avoid transient failures on
# archive.ubuntu.com / security.ubuntu.com during CI/CD pipeline builds.
# azure.archive.ubuntu.com is co-located with Azure and GitHub Actions infrastructure.
# To use a different mirror:  --build-arg UBUNTU_MIRROR=http://your-mirror/ubuntu/
# To disable and use the original Ubuntu repos: --build-arg UBUNTU_MIRROR=
ARG UBUNTU_MIRROR=http://azure.archive.ubuntu.com/ubuntu/

FROM openresty/openresty:1.31.1.1-1-jammy AS buildstep
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
  && apt-get install --no-install-recommends --no-install-suggests -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev wget git gcc make

WORKDIR /app
RUN wget -q https://nginx.org/download/nginx-1.31.1.tar.gz \
  && echo "9fcaaeb8f22544b09a19a761f3412c4112215422401634bebdd1296a403cc4bc  nginx-1.31.1.tar.gz" | sha256sum -c - \
  && tar -zxf nginx-1.31.1.tar.gz \
  && git clone https://github.com/google/ngx_brotli \
  && cd ngx_brotli \
  && git checkout a71f9312c2deb28875acc7bacfdd5695a111aa53 \
  && git submodule update --init --recursive \
  && cd .. \
  && cd nginx-1.31.1 \
  && ./configure --prefix=/usr/local/openresty/nginx --with-cc-opt='-O2 -DNGX_LUA_ABORT_AT_PANIC -I/usr/local/openresty/pcre/include -I/usr/local/openresty/openssl/include' --with-ld-opt='-Wl,-rpath,/usr/local/openresty/luajit/lib -L/usr/local/openresty/pcre/lib -L/usr/local/openresty/openssl/lib -Wl,-rpath,/usr/local/openresty/pcre/lib:/usr/local/openresty/openssl/lib' --with-pcre --with-file-aio --with-http_addition_module --with-http_auth_request_module --with-http_dav_module --with-http_flv_module --with-http_geoip_module=dynamic --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module=dynamic --with-http_mp4_module --with-http_random_index_module --with-http_realip_module --with-http_secure_link_module --with-http_slice_module --with-http_ssl_module --with-http_stub_status_module --with-http_sub_module --with-http_v2_module --with-http_xslt_module=dynamic --with-ipv6 --with-mail --with-mail_ssl_module --with-md5-asm --with-sha1-asm --with-stream --with-stream_ssl_module --with-threads --with-pcre-jit --with-stream --with-stream_ssl_preread_module --with-compat --add-dynamic-module=../ngx_brotli \
  && make modules

FROM openresty/openresty:1.31.1.1-1-jammy
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
  && apt-get install --no-install-recommends --no-install-suggests -y apache2-utils \
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
COPY robots /etc/nginx/conf.d/robots/
COPY docker-entrypoint.d/*.sh /docker-entrypoint.d/
RUN chmod 700 /docker-entrypoint.d/*.sh
COPY *.yaml /
COPY 50x.html /usr/share/nginx/html/

COPY cache_clearer.sh /
RUN chmod 700 /cache_clearer.sh

COPY --from=hairyhenderson/gomplate:v5.0.0 /gomplate /gomplate
RUN chmod 700 /gomplate
COPY --from=nginx/nginx-prometheus-exporter:1.5.1 /usr/bin/nginx-prometheus-exporter /nginx-prometheus-exporter
COPY --from=buildstep /app/nginx-1.31.1/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/
COPY --from=buildstep /app/nginx-1.31.1/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/
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
