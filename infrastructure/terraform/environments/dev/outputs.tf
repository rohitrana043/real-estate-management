# infrastructure/terraform/environments/dev/outputs.tf
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "eks_cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "eks_kubectl_config" {
  description = "kubectl config command"
  value       = module.eks.kubectl_config
}

output "rds_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = module.rds.db_instance_endpoint
}

output "s3_bucket" {
  description = "S3 bucket for application assets"
  value       = module.s3.bucket_id
}