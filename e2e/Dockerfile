FROM cypress/browsers:chrome69
RUN apt-get update || true
RUN apt-get -y install dnsutils
COPY package.json package-lock.json /tmp/
ENV CI=true
RUN cd /tmp && npm i
