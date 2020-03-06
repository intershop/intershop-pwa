FROM node:12-alpine as buildstep
WORKDIR /workspace
COPY package.json package-lock.json /workspace/
COPY tslint-rules/package.json /workspace/node_modules/intershop-tslint-rules/package.json
COPY schematics/package.json /workspace/node_modules/intershop-schematics/package.json
RUN npm i
COPY src /workspace/src/
COPY tsconfig.app.json tsconfig-es5.app.json tsconfig.json ngsw-config.json browserslist angular.json /workspace/
RUN npm run ng -- build -c production
COPY tsconfig.server.json /workspace/
RUN npm run ng -- run intershop-pwa:server:production --bundleDependencies all
COPY webpack.server.config.js server.ts /workspace/
RUN npm run webpack:server
RUN egrep -o '^\s*(mockServerAPI: true|mustMockPaths)' src/environments/environment.prod.ts || rm -Rf dist/browser/assets/mock*
COPY dist/entrypoint.sh dist/healthcheck.js dist/server.crt dist/server.key dist/robots.txt* /workspace/dist/

FROM node:12-alpine
COPY --from=buildstep /workspace/dist /dist
ARG displayVersion=
ENV DISPLAY_VERSION=$displayVersion
EXPOSE 4200
USER nobody
HEALTHCHECK --interval=60s --timeout=20s --start-period=2s CMD node /dist/healthcheck.js
ENTRYPOINT ["sh","/dist/entrypoint.sh"]
