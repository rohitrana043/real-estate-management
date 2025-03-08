# infrastructure/terraform/modules/rds/main.tf
resource "aws_db_subnet_group" "main" {
  name        = "${var.project_name}-db-subnet-group-${var.environment}"
  description = "Database subnet group for ${var.project_name} ${var.environment}"
  subnet_ids  = var.subnet_ids

  tags = {
    Name = "${var.project_name}-db-subnet-group-${var.environment}"
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg-${var.environment}"
  description = "Security group for RDS instance"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432  # PostgreSQL port
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.eks_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg-${var.environment}"
  }
}

resource "aws_db_instance" "main" {
  identifier              = "${var.project_name}-db-${var.environment}"
  allocated_storage       = 20
  storage_type            = "gp2"
  engine                  = "postgres"
  engine_version          = "15.4"
  instance_class          = var.db_instance_class
  db_name                 = var.db_name
  username                = var.db_username
  password                = var.db_password
  parameter_group_name    = "default.postgres15"
  db_subnet_group_name    = aws_db_subnet_group.main.name
  vpc_security_group_ids  = [aws_security_group.rds.id]
  backup_retention_period = 7
  multi_az                = var.multi_az
  skip_final_snapshot     = true
  deletion_protection     = var.environment == "prod" ? true : false

  tags = {
    Name = "${var.project_name}-db-${var.environment}"
  }
}