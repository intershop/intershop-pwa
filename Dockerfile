# synchronize-marker:docker-cache-share:begin
FROM node:24.19.0-alpine AS buildstep
# increase the `--max-old-space-size` if "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory" occur during build
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV CI=true
WORKDIR /workspace
COPY package.json package-lock.json /workspace/
RUN npm ci --prefer-offline --no-audit --ignore-scripts
RUN find node_modules -path '*/esbuild/install.js' | xargs -rt -n 1 node
# synchronize-marker:docker-cache-share:end
COPY tsconfig.app.json tsconfig.json ngsw-config.json angular.json eslint.config.mjs /workspace/
COPY eslint-rules /workspace/eslint-rules
COPY schematics /workspace/schematics
COPY projects /workspace/projects
COPY src /workspace/src
COPY scripts/init-development-environment.js /workspace/scripts/
RUN npm run postinstall
ARG testing=false
ENV TESTING=${testing}
RUN npm run build -- --deploy-url=DEPLOY_URL_PLACEHOLDER

FROM node:24.19.0-alpine
RUN apk add --no-cache tini
COPY --from=buildstep /workspace/dist /dist
ARG displayVersion=
LABEL displayVersion="${displayVersion}"
ENV DISPLAY_VERSION=${displayVersion}
ENV LOGLEVEL=error
ENV LOGFORMAT=json
EXPOSE 4200
USER nobody
HEALTHCHECK --interval=60s --timeout=20s --start-period=2s CMD node -e "require('http').get('http://localhost:4200', response => process.exit(response.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "/dist/server/server.mjs"]
