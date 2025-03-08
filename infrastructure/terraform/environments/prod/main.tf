# infrastructure/terraform/environments/prod/main.tf
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

# We'll create these ALB resources separately
resource "aws_lb" "api" {
  name               = "${var.project_name}-api-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnet_ids

  tags = {
    Name = "${var.project_name}-api-alb-${var.environment}"
  }
}

resource "aws_lb" "frontend" {
  name               = "${var.project_name}-frontend-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnet_ids

  tags = {
    Name = "${var.project_name}-frontend-alb-${var.environment}"
  }
}

resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg-${var.environment}"
  description = "Security group for ALB"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-alb-sg-${var.environment}"
  }
}

module "route53" {
  source = "../../modules/route53"
  
  project_name          = var.project_name
  environment           = var.environment
  domain_name           = var.domain_name
  api_alb_dns_name      = aws_lb.api.dns_name
  api_alb_zone_id       = aws_lb.api.zone_id
  frontend_alb_dns_name = aws_lb.frontend.dns_name
  frontend_alb_zone_id  = aws_lb.frontend.zone_id
}