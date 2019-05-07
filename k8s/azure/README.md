# Creating build pipeline with Azure DevOps

## Prerequisites

- [Kubernetes Cluster (AKS)](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough)
- [Container Registry (ACR)](https://docs.microsoft.com/en-us/azure/container-registry)
- [Service Principal](https://docs.microsoft.com/en-us/azure/aks/kubernetes-service-principal) for access to AKS-Cluster and also for read/write access to an [ACR](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-auth-aks?toc=%2fazure%2faks%2ftoc.json#grant-aks-access-to-acr)

## Steps for initializing the pipeline

1. Create a Service Connection (Azure Resource Manager) with the mentionend Service Principal
2. Change variables in [azure-pipelines.yml](azure-pipelines.yml)
3. Create a new build pipeline with the file [azure-pipelines.yml](azure-pipelines.yml)

# Pipeline overview

- Build pwa-main

  Builds the [Dockerfile](../Dockerfile)

- Push pwa-main

  Push the image to ACR

- Build pwa-nginx

  Build the [Dockerfile](../nginx/Dockerfile)

- Push pwa-nginx

  Push the image to ACR

- Install helm

  Install [helm](https://helm.sh) on the build agent

- helm init

  Initialize helm for access to AKS

- Install pwa-main

  Install the helm chart [pwa-main](../charts/pwa-main/) on the AKS cluster

- Install pwa-nginx

  Install the helm chart [pwa-nginx](../charts/pwa-nginx/) on the AKS cluster
