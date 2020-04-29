FROM node:12-alpine as buildstep
WORKDIR /workspace
COPY package.json package-lock.json /workspace/
COPY tslint-rules/package.json /workspace/node_modules/intershop-tslint-rules/package.json
COPY schematics/package.json /workspace/node_modules/intershop-schematics/package.json
RUN npm i
COPY src /workspace/src/
COPY tsconfig.app.json tsconfig-es5.app.json tsconfig.json ngsw-config.json browserslist angular.json /workspace/
ARG serviceWorker
COPY schematics/customization/service-worker /workspace/schematics/customization/service-worker
RUN node schematics/customization/service-worker ${serviceWorker} || true
ARG configuration=production
RUN npm run ng -- build -c ${configuration}
COPY tsconfig.server.json server.ts /workspace/
RUN npm run ng -- run intershop-pwa:server:${configuration} --bundleDependencies
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
