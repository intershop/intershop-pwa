# synchronize-marker:docker-cache-share:begin
FROM node:24.19.0-alpine AS buildstep
# increase the `--max-old-space-size` if "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory" occur during build
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV CI=true
WORKDIR /workspace
COPY package.json package-lock.json /workspace/
COPY tools/postcss-purgecss-config /workspace/tools/postcss-purgecss-config
RUN npm ci --prefer-offline --no-audit --ignore-scripts
RUN find node_modules -path '*/esbuild/install.js' | xargs -rt -n 1 node
# synchronize-marker:docker-cache-share:end
COPY tsconfig.app.json tsconfig.json angular.json eslint.config.mjs .postcssrc.json /workspace/
COPY builders /workspace/builders
COPY eslint-rules /workspace/eslint-rules
COPY schematics /workspace/schematics
COPY templates/esbuild/define-build-constants.ts /workspace/templates/esbuild/define-build-constants.ts
COPY projects /workspace/projects
COPY src /workspace/src
COPY scripts/init-development-environment.js scripts/build-multi-pwa.js scripts/build-pwa.js scripts/build-ssr-runtime.js scripts/remove-data-testing-attributes.cjs /workspace/scripts/
RUN npm run postinstall
ARG testing=false
ENV TESTING=${testing}
ARG activeThemes=b2b,b2c
ARG purgeCss=true
ENV PURGE_CSS=${purgeCss}
RUN ACTIVE_THEMES="${activeThemes}" npm run build:multi -- --deploy-url=DEPLOY_URL_PLACEHOLDER
RUN npm install --package-lock-only --prefix dist --ignore-scripts --no-audit

FROM node:24.19.0-alpine
RUN apk add --no-cache tini
COPY --from=buildstep /workspace/dist /dist
RUN cd /dist && npm ci --omit=dev --ignore-scripts --no-audit && \
    chmod 755 /dist/entrypoint.sh && \
    touch /dist/ecosystem.json && chown nobody:nobody /dist/ecosystem.json && chmod 644 /dist/ecosystem.json
ARG displayVersion=
LABEL displayVersion="${displayVersion}"
ENV DISPLAY_VERSION=${displayVersion}
ENV LOGLEVEL=error
ENV LOGFORMAT=json
ENV NODE_PATH=/dist/node_modules
ENV PATH=/dist/node_modules/.bin:$PATH
ENV PM2_HOME=/tmp/pm2
EXPOSE 4200 9113
USER nobody
HEALTHCHECK --interval=60s --timeout=20s --start-period=2s CMD node /dist/healthcheck.cjs
ENTRYPOINT ["/sbin/tini", "--", "sh", "/dist/entrypoint.sh"]
CMD ["start"]
