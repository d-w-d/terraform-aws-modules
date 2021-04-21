
output "bucket_website_endpoint" {
  description = "Needed for cloudfront association"
  value       = aws_s3_bucket.my_bucket_resource.website_endpoint
}

output "bucket_name" {
  description = "Needed for cloudfront association"
  value       = aws_s3_bucket.my_bucket_resource.bucket
}


