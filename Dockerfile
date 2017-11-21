FROM openjdk:8-jdk as buildstep
COPY gradle /workspace/gradle/
COPY package.json package-lock.json build.gradle settings.gradle gradlew /workspace/
WORKDIR /workspace
RUN ./gradlew --no-daemon --max-workers 1 npmInstall
COPY . /workspace
ENV PATH=$PATH:/workspace/node_modules/.bin
ARG env=dev
RUN ./gradlew --no-daemon --max-workers 1 npmRun -Pnpmargs="run build:dynamic:${env}"

FROM node:8-alpine
COPY --from=buildstep /workspace/dist /workspace/healthcheck.js /
EXPOSE 4000
USER nobody
HEALTHCHECK --interval=60s --timeout=10s --start-period=20s CMD node /healthcheck.js
ENTRYPOINT ["node", "server"]
ENV ICM_BASE_URL=http://localhost:4000
