# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.134.0/containers/javascript-node/.devcontainer/base.Dockerfile
ARG VARIANT="18"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

ENV NODE_OPTIONS=--max_old_space_size=8192 LOGGING=true TRUST_ICM=true
RUN sudo -u node npm install --ignore-scripts -g @angular/cli@16
COPY shellrc.sh /home/node/.shellrc
RUN echo ". /home/node/.shellrc" >> /home/node/.zshrc && echo ". /home/node/.shellrc" >> /home/node/.bashrc
