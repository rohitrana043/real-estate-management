#!/bin/bash

# Build Docker image
docker build -t frontend-image:latest .

# Load image to kind cluster (if using kind)
kind load docker-image frontend-image:latest

# Apply Kubernetes configurations
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml

# Verify deployment
kubectl get deployments
kubectl get services
kubectl get pods