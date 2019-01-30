FROM sheogorath/nginx-pagespeed
COPY nginx.conf /etc/nginx/nginx.conf
COPY perf.common icm.common.tmpl channel.conf.tmpl /etc/nginx/conf.d/
COPY entrypoint.sh /
ENV NPSC_ENABLE_FILTERS=in_place_optimize_for_browser,prioritize_critical_css,inline_preview_images,lazyload_images,rewrite_images,rewrite_css,remove_comments,local_storage_cache,move_css_to_head,move_css_above_scripts,collapse_whitespace,combine_javascript,extend_cache NPSC_JS_PRESERVE_UR_Ls=on

ENTRYPOINT [ "sh", "entrypoint.sh" ]
