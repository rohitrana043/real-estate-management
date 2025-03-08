# infrastructure/terraform/environments/prod/variables.tf
variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ca-central-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "real-estate"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "azs" {
  description = "Availability zones to use"
  type        = list(string)
  default     = ["ca-central-1a", "ca-central-1b"]
}

variable "private_subnets" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnets" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.27"
}

variable "desired_capacity" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "min_size" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 5
}

variable "instance_types" {
  description = "EC2 instance types to use for worker nodes"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "db_name" {
  description = "Name for RDS database"
  type        = string
  default     = "real_estate"
}

variable "db_username" {
  description = "Username for RDS database"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Password for RDS database"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.small"
}

variable "multi_az" {
  description = "Enable Multi-AZ for RDS"
  type        = bool
  default     = true
}

variable "bucket_name" {
  description = "Name for S3 bucket"
  type        = string
  default     = "management-system"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "your-production-domain.com"
}