FROM nginx:mainline-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY perf.common icm.common.tmpl channel.conf.tmpl /etc/nginx/conf.d/
COPY entrypoint.sh /
ENTRYPOINT [ "sh", "entrypoint.sh" ]
