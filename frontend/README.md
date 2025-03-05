# Frontend Deployment Guide

## Prerequisites

- Docker
- Kubernetes (Minikube or Kind)
- kubectl

## Deployment Steps

1. **Build Docker Image**

   ```bash
   docker build -t frontend-image:latest .
   ```

2. **Load Image to Kubernetes Cluster** (if using Kind)

   ```bash
   kind load docker-image frontend-image:latest
   ```

3. **Apply Kubernetes Configurations**

   ```bash
   kubectl apply -f frontend-deployment.yaml
   ```

4. **Verify Deployment**
   ```bash
   kubectl get deployments
   kubectl get services
   kubectl get pods
   ```

## Configuration Notes

- The deployment uses a ConfigMap and Secret to manage environment variables
- Adjust the replica count, resources, and other settings in the deployment file as needed

## Environment Variables

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `NEXT_PUBLIC_GOOGLE_MAPS_ADDRESS`: Default Google Maps address
- `NEXT_NODE_ENV`: Node environment (production)
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Troubleshooting

- Check pod logs: `kubectl logs <pod-name>`
- Describe pods: `kubectl describe pod <pod-name>`
