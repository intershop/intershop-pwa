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
COPY --from=buildstep /workspace/dist /
EXPOSE 4000
USER nobody
#HEALTHCHECK CMD wget -qO- http://localhost:4000/
ENTRYPOINT ["node", "server"]
