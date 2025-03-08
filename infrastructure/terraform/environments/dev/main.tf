# infrastructure/terraform/environments/dev/main.tf
provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "../../modules/vpc"
  
  project_name    = var.project_name
  environment     = var.environment
  vpc_cidr        = var.vpc_cidr
  azs             = var.azs
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets
}

module "eks" {
  source = "../../modules/eks"
  
  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  desired_capacity   = var.desired_capacity
  min_size           = var.min_size
  max_size           = var.max_size
  instance_types     = var.instance_types
  kubernetes_version = var.kubernetes_version
}

module "rds" {
  source = "../../modules/rds"
  
  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  subnet_ids            = module.vpc.private_subnet_ids
  eks_security_group_id = module.eks.cluster_security_group_id
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = var.db_password
  db_instance_class     = var.db_instance_class
  multi_az              = var.multi_az
}

module "s3" {
  source = "../../modules/s3"
  
  project_name = var.project_name
  environment  = var.environment
  bucket_name  = var.bucket_name
}