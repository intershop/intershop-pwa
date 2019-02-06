FROM node:10-alpine as buildstep
COPY package.json package-lock.json /workspace/
COPY tslint-rules /workspace/tslint-rules/
WORKDIR /workspace
RUN npm ci --production
COPY . /workspace
RUN npm run build
RUN echo -e "trap \"ps -o pid,comm | grep node | awk '{print $1}' | xargs -r kill\" INT TERM\nnode server" > /workspace/dist/start.sh

FROM node:10-alpine
COPY --from=buildstep /workspace/dist /workspace/healthcheck.js /
ARG displayVersion=
ENV DISPLAY_VERSION=$displayVersion
EXPOSE 4200
USER nobody
HEALTHCHECK --interval=60s --timeout=20s --start-period=2s CMD node /healthcheck.js
ENTRYPOINT ["sh","/start.sh"]
