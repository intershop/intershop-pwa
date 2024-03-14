FROM openresty/openresty:1.21.4.3-1-jammy AS buildstep
RUN apt-get update \
  && apt-get install --no-install-recommends --no-install-suggests -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev wget git gcc make

WORKDIR /app
RUN wget -q https://nginx.org/download/nginx-1.21.4.tar.gz && tar -zxf nginx-1.21.4.tar.gz \
  && git clone --recurse-submodules -j8 https://github.com/google/ngx_brotli \
  && cd nginx-1.21.4 \
  && ./configure --prefix=/usr/local/openresty/nginx --with-cc-opt='-O2 -DNGX_LUA_ABORT_AT_PANIC -I/usr/local/openresty/pcre/include -I/usr/local/openresty/openssl/include' --with-ld-opt='-Wl,-rpath,/usr/local/openresty/luajit/lib -L/usr/local/openresty/pcre/lib -L/usr/local/openresty/openssl/lib -Wl,-rpath,/usr/local/openresty/pcre/lib:/usr/local/openresty/openssl/lib' --with-pcre --with-file-aio --with-http_addition_module --with-http_auth_request_module --with-http_dav_module --with-http_flv_module --with-http_geoip_module=dynamic --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module=dynamic --with-http_mp4_module --with-http_random_index_module --with-http_realip_module --with-http_secure_link_module --with-http_slice_module --with-http_ssl_module --with-http_stub_status_module --with-http_sub_module --with-http_v2_module --with-http_xslt_module=dynamic --with-ipv6 --with-mail --with-mail_ssl_module --with-md5-asm --with-sha1-asm --with-stream --with-stream_ssl_module --with-threads --with-pcre-jit --with-stream --with-stream_ssl_preread_module --with-compat --add-dynamic-module=../ngx_brotli \
  && make modules

FROM openresty/openresty:1.21.4.3-1-jammy
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

RUN apt-get update \
  && apt-get install --no-install-recommends --no-install-suggests -y apache2-utils libnss3-tools \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY features /etc/nginx/features/
COPY templates /etc/nginx/templates/
COPY docker-entrypoint.d/*.sh /docker-entrypoint.d/
COPY *.yaml /
COPY 50x.html /usr/share/nginx/html/
ADD https://github.com/hairyhenderson/gomplate/releases/download/v3.8.0/gomplate_linux-amd64-slim /gomplate
RUN chmod 700 /gomplate
ADD https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64 /usr/bin/mkcert
RUN chmod 700 /usr/bin/mkcert
COPY --from=nginx/nginx-prometheus-exporter:1.0.0 /usr/bin/nginx-prometheus-exporter /nginx-prometheus-exporter
COPY --from=buildstep /app/nginx-1.21.4/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/
COPY --from=buildstep /app/nginx-1.21.4/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/
ENV CACHE=on
ENV COMPRESSION=on
ENV DEVICE_DETECTION=on
ENV SSR=on
ENV SSL=off
ENV CACHE_DURATION_NGINX_OK=10m
ENV CACHE_DURATION_NGINX_NF=60m
ENV LOGFORMAT=main
ENV LOG_ALL=on

EXPOSE 80 443 9113
