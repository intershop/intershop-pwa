FROM cypress/browsers:chrome69
RUN apt-get update || true
RUN apt-get -y install dnsutils
WORKDIR /
COPY . .
ENV CI=true
RUN npm ci
