provider "aws" {
  region = "us-east-1"
}

module "demo_s3_simple_static_site_module" {
  # source      = "git@d-w-d.github.com:d-w-d/terraform-aws-modules.git//modules/s3_simple_static_site"
  source      = "../../modules/s3_simple_static_site"
  bucket_name = var.SIMPLE_SITE_BUCKET_NAME
}
