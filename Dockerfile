FROM node:14-alpine as buildstep
WORKDIR /workspace
COPY package.json package-lock.json /workspace/
RUN npm i --ignore-scripts
RUN find node_modules -path '*/esbuild/install.js' | xargs -rt -n 1 node
RUN npm run ngcc
COPY tsconfig.app.json tsconfig.json ngsw-config.json .browserslistrc angular.json tslint.json /workspace/
COPY tslint-rules /workspace/tslint-rules
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
RUN if [ ! -z "${activeThemes}" ]; then npm config set intershop-pwa:active-themes="${activeThemes}"; fi
RUN npm run build:multi client -- --deploy-url=DEPLOY_URL_PLACEHOLDER
COPY tsconfig.server.json server.ts /workspace/
RUN npm run build:multi server
# remove cache check for resources (especially index.html)
# https://github.com/angular/angular/issues/23613#issuecomment-415886919
RUN test "${serviceWorker}" = "true" && sed -i 's/canonicalHash !== cacheBustedHash/false/g' /workspace/dist/browser/ngsw-worker.js || true
RUN node scripts/compile-docker-scripts
COPY dist/* /workspace/dist/

FROM node:14-alpine
COPY --from=buildstep /workspace/dist /dist
RUN cd dist && npm install
ARG displayVersion=
LABEL displayVersion="${displayVersion}"
ENV DISPLAY_VERSION=${displayVersion} NODE_PATH=/dist/node_modules PATH=$PATH:/dist/node_modules/.bin
EXPOSE 4200
RUN mkdir /.pm2 && chmod 777 -Rf /.pm2 && touch /dist/ecosystem.yml && chmod 777 -f /dist/ecosystem.yml
USER nobody
HEALTHCHECK --interval=60s --timeout=20s --start-period=2s CMD node /dist/healthcheck.js
ENTRYPOINT ["sh","/dist/entrypoint.sh"]
