FROM node:8-alpine as buildstep
COPY package.json package-lock.json /workspace/
COPY tslint-rules /workspace/tslint-rules/
WORKDIR /workspace
RUN npm install
COPY . /workspace
ENV PATH=$PATH:/workspace/node_modules/.bin
ARG env=dev
RUN npm run build:dynamic:${env}

FROM node:8-alpine
COPY --from=buildstep /workspace/dist /workspace/healthcheck.js /
EXPOSE 4000
USER nobody
HEALTHCHECK --interval=60s --timeout=10s --start-period=20s CMD node /healthcheck.js
ENTRYPOINT ["node", "server"]
ENV ICM_BASE_URL=http://localhost:4000
