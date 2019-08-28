FROM node:10-alpine as buildstep
COPY . /workspace/
WORKDIR /workspace
RUN npm ci
RUN npm run build
RUN egrep -o '^\s*(mockServerAPI: true|mustMockPaths)' src/environments/environment.prod.ts || rm -Rf dist/browser/assets/mock*

FROM node:10-alpine
COPY --from=buildstep /workspace/dist /
ARG displayVersion=
ENV DISPLAY_VERSION=$displayVersion
EXPOSE 4200
USER nobody
HEALTHCHECK --interval=60s --timeout=20s --start-period=2s CMD node /healthcheck.js
ENTRYPOINT ["sh","/entrypoint.sh"]
