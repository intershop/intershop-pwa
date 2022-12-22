# synchronize-marker:docker-cache-share:begin
FROM node:16.16.0-alpine as buildstep
ENV CI=true
WORKDIR /workspace
COPY package.json package-lock.json /workspace/
RUN npm ci --prefer-offline --no-audit --ignore-scripts
RUN find node_modules -path '*/esbuild/install.js' | xargs -rt -n 1 node
RUN npm run ngcc
# synchronize-marker:docker-cache-share:end
COPY tsconfig.app.json tsconfig.json ngsw-config.json .browserslistrc angular.json .eslintrc.json /workspace/
COPY eslint-rules /workspace/eslint-rules
COPY schematics /workspace/schematics
COPY projects /workspace/projects
COPY src /workspace/src
COPY scripts /workspace/scripts/
RUN npm run postinstall
ARG serviceWorker
RUN node schematics/customization/service-worker ${serviceWorker} || true
COPY templates/webpack/* /workspace/templates/webpack/
ARG testing=false
ENV TESTING=${testing}
ARG activeThemes=
RUN if [ ! -z "${activeThemes}" ]; then npm config set active-themes="${activeThemes}"; fi
RUN npm run build:multi client -- --deploy-url=DEPLOY_URL_PLACEHOLDER
COPY tsconfig.server.json server.ts /workspace/
RUN npm run build:multi server
RUN node scripts/compile-docker-scripts
COPY dist/* /workspace/dist/

FROM node:16.16.0-alpine
COPY --from=buildstep /workspace/dist /dist
RUN cd dist && npm install
ARG displayVersion=
LABEL displayVersion="${displayVersion}"
ENV DISPLAY_VERSION=${displayVersion} NODE_PATH=/dist/node_modules PATH=$PATH:/dist/node_modules/.bin
EXPOSE 4200 9113
RUN mkdir /.pm2 && chmod 777 -Rf /.pm2 && touch /dist/ecosystem.yml && chmod 777 -f /dist/ecosystem.yml
USER nobody
HEALTHCHECK --interval=60s --timeout=20s --start-period=2s CMD node /dist/healthcheck.js
ENTRYPOINT ["sh","/dist/entrypoint.sh"]
