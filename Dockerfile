# synchronize-marker:docker-cache-share:begin
FROM node:22.22.0-alpine AS buildstep
# increase the `--max-old-space-size` if "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory" occur during build
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV CI=true
WORKDIR /workspace
COPY package.json package-lock.json /workspace/
RUN npm ci --prefer-offline --no-audit --ignore-scripts
RUN find node_modules -path '*/esbuild/install.js' | xargs -rt -n 1 node
# synchronize-marker:docker-cache-share:end
COPY tsconfig.app.json tsconfig.json ngsw-config.json angular.json .eslintrc.json /workspace/
COPY eslint-rules /workspace/eslint-rules
COPY schematics /workspace/schematics
COPY projects /workspace/projects
COPY src /workspace/src
COPY scripts /workspace/scripts/
RUN npm run postinstall
ARG serviceWorker
RUN node schematics/customization/service-worker ${serviceWorker} || true
COPY templates/webpack/* /workspace/templates/webpack/
COPY tsconfig.server.json server.ts /workspace/
COPY babel.config.js /workspace/
ARG testing=false
ENV TESTING=${testing}
ARG activeThemes=
RUN if [ ! -z "${activeThemes}" ]; then npm pkg set config.active-themes="${activeThemes}"; fi
RUN npm run build:multi -- --deploy-url=DEPLOY_URL_PLACEHOLDER
RUN node scripts/compile-docker-scripts
COPY dist/* /workspace/dist/

FROM node:22.22.0-alpine
RUN apk add --no-cache tini
COPY --from=buildstep /workspace/dist /dist
RUN cd dist && npm install
ARG displayVersion=
LABEL displayVersion="${displayVersion}"
ENV DISPLAY_VERSION=${displayVersion} NODE_PATH=/dist/node_modules PATH=$PATH:/dist/node_modules/.bin
ENV LOGLEVEL=error
ENV LOGFORMAT=json
EXPOSE 4200 9113
RUN mkdir /.pm2 && chown nobody:nobody /.pm2 && chmod 700 /.pm2 && \
    touch /dist/ecosystem.yml && chown nobody:nobody /dist/ecosystem.yml && chmod 644 /dist/ecosystem.yml
USER nobody
HEALTHCHECK --interval=60s --timeout=20s --start-period=2s CMD node /dist/healthcheck.js
ENTRYPOINT [ "/sbin/tini", "--", "sh", "/dist/entrypoint.sh" ]
