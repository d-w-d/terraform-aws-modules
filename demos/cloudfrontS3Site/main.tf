provider "aws" {
  region = "us-east-1"
}

module "demo_s3_cloudfront_static_site_module" {
  # source      = "git@d-w-d.github.com:d-w-d/terraform-aws-modules.git//modules/s3_simple_static_site"
  source      = "../../modules/s3_simple_static_site"
  bucket_name = var.CLOUDFRONT_SITE_BUCKET_NAME
}

module "demo_cloudfront_module" {
  source      = "../../modules/cloudfront"
  domain_name = module.demo_s3_cloudfront_static_site_module.bucket_website_endpoint
  bucket_name = module.demo_s3_cloudfront_static_site_module.bucket_name
}
