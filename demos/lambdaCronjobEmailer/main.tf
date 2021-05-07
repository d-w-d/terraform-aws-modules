provider "aws" {
  region = "us-east-1"
}

module "lambda_emailer_function_module" {
  # source                  = "git@d-w-d.github.com:d-w-d/terraform-aws-modules.git//modules/lambda_emailer_function"
  source                    = "../../modules/lambda_emailer_function"
  prefix                    = var.PREFIX
  lambda_function_name      = var.LAMBDA_FUNCTION_NAME
  zipped_file_and_path_name = abspath("./dist-lambda/exports.js.zip")
  STATIC_SENDER_EMAIL       = var.STATIC_SENDER_EMAIL
  STATIC_RECEIVER_EMAIL     = var.STATIC_RECEIVER_EMAIL
  RECAPTCHA_SECRET          = var.RECAPTCHA_SECRET
  RECAPTCHA_BYPASS_CODE     = var.RECAPTCHA_BYPASS_CODE
}

module "cloudwatch_triggering_lambda_module" {
  # source             = "git@d-w-d.github.com:d-w-d/terraform-aws-modules.git//modules/cloudwatch_triggering_lambda"
  source               = "../../modules/cloudwatch_triggering_lambda"
  lambda_function_name = module.lambda_emailer_function_module.lambda_function_name
  lambda_function_arn  = module.lambda_emailer_function_module.lambda_function_arn
  cronjob              = "0 * * * ? *"
}
