# Kubernetes Deployment

## Prerequisites

- [Kubernetes Cluster (AKS)](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough)
- [Container Registry (ACR)](https://docs.microsoft.com/en-us/azure/container-registry)
- [Service Principal](https://docs.microsoft.com/en-us/azure/aks/kubernetes-service-principal) for access to AKS-Cluster and also for read/write access to an [ACR](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-auth-aks?toc=%2fazure%2faks%2ftoc.json#grant-aks-access-to-acr)

## Schematics

To generate the Helm Charts for a Kubernetes Deployment run `ng g kubernetes-deployment`.
