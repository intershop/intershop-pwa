FROM cypress/browsers:node12.16.1-chrome80-ff73
RUN apt-get update || true
RUN apt-get -y install dnsutils jq
COPY package.json package-lock.json /tmp/
ENV CI=true
RUN cd /tmp && npm i
