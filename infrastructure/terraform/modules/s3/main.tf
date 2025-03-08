# infrastructure/terraform/modules/s3/main.tf
resource "aws_s3_bucket" "main" {
  bucket = "${var.project_name}-${var.bucket_name}-${var.environment}"

  tags = {
    Name        = "${var.project_name}-${var.bucket_name}-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_ownership_controls" "main" {
  bucket = aws_s3_bucket.main.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "main" {
  depends_on = [aws_s3_bucket_ownership_controls.main]
  bucket     = aws_s3_bucket.main.id
  acl        = "private"
}

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}