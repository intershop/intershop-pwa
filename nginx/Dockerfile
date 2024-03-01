FROM nginx:1.22 AS builder
RUN apt-get update \
  && apt-get install --no-install-recommends --no-install-suggests -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev wget git gcc make libbrotli-dev

WORKDIR /app
RUN wget -q https://nginx.org/download/nginx-1.22.1.tar.gz && tar -zxf nginx-1.22.1.tar.gz \
    && git clone https://github.com/google/ngx_brotli.git \
    && cd ngx_brotli \
    && git submodule update --init \
    && cd ../nginx-1.22.1 \
    && ./configure --with-compat --add-dynamic-module=../ngx_brotli \
    && make modules

FROM nginx:1.22
RUN apt-get update \
  && apt-get install --no-install-recommends --no-install-suggests -y apache2-utils libnss3-tools
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

COPY --from=builder /app/nginx-1.22.1/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/
COPY --from=builder /app/nginx-1.22.1/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/

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
