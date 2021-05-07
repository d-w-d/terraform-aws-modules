
# All variables set in .env with TF_VAR_ prefix

variable "PREFIX" {
  description = "Prefix to be applied to all variables supplied by .env file"
}

variable "STATIC_RECEIVER_EMAIL" {
  description = "Email account to receive emails; to be provisioned as .env var in lambda function; supplied by .env file"
}

variable "STATIC_SENDER_EMAIL" {
  description = "Email account 'from' which emails are sent; to be provisioned as .env var in lambda function; supplied by .env file"
}

variable "RECAPTCHA_SECRET" {
  description = "If a recaptcha secret key is provided, then the Lambda function will seek to verify a recaptcha token passed from client"
}

variable "RECAPTCHA_BYPASS_CODE" {
  description = "If this bypass code is provided at endpoint invocation, then the requirement for RECAPTCHA will be bypassed"
}

