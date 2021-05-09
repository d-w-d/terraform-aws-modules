resource "aws_s3_bucket" "my_bucket_resource" {
  bucket = var.bucket_name
  acl    = var.bucket_acl

  policy = <<-POLICY
  {
    "Version":"2012-10-17",
    "Statement":[
      {
        "Sid":"AddPerm",
        "Effect":"Allow",
        "Principal": "*",
        "Action":["s3:GetObject"],
        "Resource":["arn:aws:s3:::${var.bucket_name}/*"]
      }
    ]
  }
POLICY


  # Conditional cors_rule block
  dynamic "cors_rule" {
    for_each = var.cors_rule_enabled ? [1] : []
    content {
      allowed_headers = var.cors_rule_allowed_headers
      allowed_methods = var.cors_rule_allowed_methods
      allowed_origins = var.cors_rule_allowed_origins
      expose_headers  = var.cors_rule_expose_headers
      max_age_seconds = var.cors_rule_max_age_seconds
    }
  }


  # Conditional website block
  dynamic "website" {
    for_each = var.website_enabled ? [1] : []
    content {
      index_document = var.website_index_document
      error_document = var.website_error_document
      # routing_rules = jsonencode(
      #   [{
      #     "Condition" : {
      #       "KeyPrefixEquals" : "docs/"
      #     },
      #     "Redirect" : {
      #       "ReplaceKeyPrefixWith" : "documents/"
      #     }
      #   }]
      # )
    }
  }
}
