# infrastructure/terraform/modules/rds/variables.tf
variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "subnet_ids" {
  description = "IDs of the subnets to place the RDS instance in"
  type        = list(string)
}

variable "eks_security_group_id" {
  description = "ID of the EKS security group"
  type        = string
}

variable "db_name" {
  description = "Name for RDS database"
  type        = string
}

variable "db_username" {
  description = "Username for RDS database"
  type        = string
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