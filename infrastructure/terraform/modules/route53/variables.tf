# infrastructure/terraform/modules/route53/variables.tf
variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}

variable "api_alb_dns_name" {
  description = "DNS name of the API ALB"
  type        = string
}

variable "api_alb_zone_id" {
  description = "Zone ID of the API ALB"
  type        = string
}

variable "frontend_alb_dns_name" {
  description = "DNS name of the frontend ALB"
  type        = string
}

variable "frontend_alb_zone_id" {
  description = "Zone ID of the frontend ALB"
  type        = string
}