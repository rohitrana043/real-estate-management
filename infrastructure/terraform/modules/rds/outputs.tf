# infrastructure/terraform/modules/rds/outputs.tf
output "db_instance_endpoint" {
  description = "Connection endpoint for the RDS instance"
  value       = aws_db_instance.main.endpoint
}

output "db_instance_address" {
  description = "Address of the RDS instance"
  value       = aws_db_instance.main.address
}

output "db_instance_port" {
  description = "Port of the RDS instance"
  value       = aws_db_instance.main.port
}

output "db_instance_name" {
  description = "Name of the RDS database"
  value       = aws_db_instance.main.db_name
}

output "db_instance_username" {
  description = "Username for the RDS database"
  value       = aws_db_instance.main.username
}