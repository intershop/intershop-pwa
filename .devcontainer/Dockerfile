# https://github.com/devcontainers/images/tree/main/src/javascript-node
ARG VARIANT="22"
FROM mcr.microsoft.com/devcontainers/javascript-node:${VARIANT}

ENV NODE_OPTIONS=--max_old_space_size=8192 LOGGING=true TRUST_ICM=true
RUN sudo -u node npm install --ignore-scripts -g @angular/cli@16
COPY shellrc.sh /home/node/.shellrc
RUN echo ". /home/node/.shellrc" >> /home/node/.zshrc && echo ". /home/node/.shellrc" >> /home/node/.bashrc
