# Specify region
provider "aws" {
  region = "us-east-1"
}

# Lambda-emailer-function module with api-gateway-integration module
module "lambda_emailer_function_module" {
  # source      = "git@d-w-d.github.com:d-w-d/terraform-aws-modules.git//modules/lambda_emailer_function"
  source                        = "../../modules/lambda_emailer_function"
  prefix                        = var.PREFIX
  lambda_function_name          = var.LAMBDA_FUNCTION_NAME
  zipped_file_and_path_name     = abspath("./dist-lambda/exports.js.zip")
  STATIC_PRIMARY_SENDER_EMAIL   = var.STATIC_PRIMARY_SENDER_EMAIL
  STATIC_SECONDARY_SENDER_EMAIL = var.STATIC_SECONDARY_SENDER_EMAIL
  STATIC_RECEIVER_EMAILS        = var.STATIC_RECEIVER_EMAILS
  RECAPTCHA_SECRET              = var.RECAPTCHA_SECRET
  RECAPTCHA_BYPASS_CODE         = var.RECAPTCHA_BYPASS_CODE
}

module "api_gateway_triggering_lambda_module" {
  # source      = "git@d-w-d.github.com:d-w-d/terraform-aws-modules.git//modules/api_gateway_triggering_lambda"
  source                     = "../../modules/api_gateway_triggering_lambda"
  prefix                     = var.PREFIX
  lambda_function_name       = module.lambda_emailer_function_module.lambda_function_name
  lambda_function_invoke_arn = module.lambda_emailer_function_module.lambda_function_invoke_arn
}
