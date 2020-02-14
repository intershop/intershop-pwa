FROM cypress/browsers:node12.14.0-chrome79-ff71
RUN apt-get update || true
RUN apt-get -y install dnsutils jq
COPY package.json package-lock.json /tmp/
ENV CI=true
RUN cd /tmp && npm i
