# infrastructure/terraform/modules/s3/variables.tf
variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "bucket_name" {
  description = "Base name for S3 bucket"
  type        = string
}