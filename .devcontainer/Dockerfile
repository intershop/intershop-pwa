# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.134.0/containers/javascript-node/.devcontainer/base.Dockerfile
ARG VARIANT="14"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

ENV NODE_OPTIONS=--max_old_space_size=8192 LOGGING=true TRUST_ICM=true
RUN sudo -u node npm install --ignore-scripts -g @angular/cli
