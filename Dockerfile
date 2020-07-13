FROM node:12-alpine as buildstep
WORKDIR /workspace
COPY schematics /workspace/schematics/
COPY package.json package-lock.json /workspace/
RUN npm i --ignore-scripts
COPY projects/organization-management/src/app /workspace/projects/organization-management/src/app/
COPY projects/requisition-management/src/app /workspace/projects/requisition-management/src/app/
COPY src /workspace/src/
COPY tsconfig.app.json tsconfig.base.json ngsw-config.json .browserslistrc angular.json /workspace/
RUN npm run build:schematics && npm run synchronize-lazy-components -- --ci
ARG configuration=production
COPY scripts /workspace/scripts/
RUN test "${configuration}" = 'local' && node scripts/init-local-environment.js || true
ARG serviceWorker
RUN node schematics/customization/service-worker ${serviceWorker} || true
RUN npm run ng -- build -c ${configuration}
COPY tsconfig.server.json server.ts /workspace/
RUN npm run ng -- run intershop-pwa:server:${configuration} --bundleDependencies
# remove cache check for resources (especially index.html)
# https://github.com/angular/angular/issues/23613#issuecomment-415886919
RUN test "${serviceWorker}" = "true" && sed -i 's/canonicalHash !== cacheBustedHash/false/g' /workspace/dist/browser/ngsw-worker.js || true
RUN egrep -o '^\s*(mockServerAPI: true|mustMockPaths)' src/environments/environment.prod.ts || rm -Rf dist/browser/assets/mock*
COPY dist/entrypoint.sh dist/healthcheck.js dist/server.crt dist/server.key dist/robots.txt* /workspace/dist/

FROM node:12-alpine
COPY --from=buildstep /workspace/dist /dist
ARG displayVersion=
LABEL displayVersion="${displayVersion}"
ENV DISPLAY_VERSION=${displayVersion}
ARG configuration=production
LABEL configuration="${configuration}"
EXPOSE 4200
USER nobody
HEALTHCHECK --interval=60s --timeout=20s --start-period=2s CMD node /dist/healthcheck.js
ENTRYPOINT ["sh","/dist/entrypoint.sh"]
