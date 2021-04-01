FROM ubuntu:latest as buildstep
RUN apt-get update
RUN apt-get install -y curl build-essential zlib1g-dev libpcre3-dev unzip wget uuid-dev sudo openssl libssl-dev
RUN curl -kfL -sS https://ngxpagespeed.com/install > install.sh
RUN bash install.sh --nginx-version latest --additional-nginx-configure-arguments '--with-http_ssl_module --with-http_stub_status_module'

FROM scratch as configstep
COPY --from=nginx:mainline /etc/nginx /etc/nginx
COPY nginx.conf /etc/nginx/
COPY features /etc/nginx/features/
COPY channel.conf.tmpl /etc/nginx/conf.d/
COPY entrypoint.sh multi-channel.yaml /
COPY 50x.html /usr/share/nginx/html/
ADD https://github.com/hairyhenderson/gomplate/releases/download/v3.8.0/gomplate_linux-amd64-slim /gomplate

FROM ubuntu:latest
RUN apt-get update && \
  apt-get install -y gettext-base libssl1.1 && \
  apt-get -y autoremove && \
  apt-get clean && \
  rm -r /var/cache/apt /var/lib/apt/lists
COPY --from=buildstep /usr/local/nginx /usr/local/nginx
COPY --from=nginx/nginx-prometheus-exporter:0.9.0 /usr/bin/nginx-prometheus-exporter /nginx-prometheus-exporter
COPY --from=configstep / /
RUN chmod 777 /gomplate
ENV NPSC_ENABLE_FILTERS=in_place_optimize_for_browser,prioritize_critical_css,inline_preview_images,lazyload_images,rewrite_images,rewrite_css,remove_comments,move_css_to_head,move_css_above_scripts,collapse_whitespace,combine_javascript,extend_cache NPSC_JsPreserveURLs=off NPSC_ImagePreserveURLs=on NPSC_ForceCaching=off CACHE=on COMPRESSION=on PAGESPEED=on DEVICE_DETECTION=on

EXPOSE 80 443 9113

ENTRYPOINT [ "sh", "entrypoint.sh" ]
